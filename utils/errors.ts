/**
 * Centralized Error Handling System
 * Provides structured error classes and error management utilities
 */

/**
 * Base application error class
 */
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/reporting
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get user-friendly error message
   */
  abstract getUserMessage(): string;
}

/**
 * API-related errors
 */
export class ApiError extends AppError {
  readonly code = 'API_ERROR';
  
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly endpoint?: string,
    originalError?: Error
  ) {
    super(message, { endpoint, statusCode }, originalError);
  }

  getUserMessage(): string {
    switch (this.statusCode) {
      case 400:
        return 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
      case 401:
        return 'Yetkilendirme hatası. Lütfen giriş yapın.';
      case 403:
        return 'Bu işlem için yetkiniz bulunmuyor.';
      case 404:
        return 'İstenen kaynak bulunamadı.';
      case 429:
        return 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.';
      case 500:
        return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      case 503:
        return 'Servis geçici olarak kullanılamıyor.';
      default:
        return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    }
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 0;

  constructor(message: string, originalError?: Error) {
    super(message, undefined, originalError);
  }

  getUserMessage(): string {
    return 'İnternet bağlantısı sorunu. Lütfen bağlantınızı kontrol edin.';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string,
    public readonly field?: string,
    public readonly expectedType?: string,
    public readonly receivedValue?: unknown
  ) {
    super(message, { field, expectedType, receivedValue });
  }

  getUserMessage(): string {
    if (this.field) {
      return `${this.field} alanında geçersiz veri.`;
    }
    return 'Girilen veriler geçersiz.';
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends AppError {
  readonly code = 'CONFIGURATION_ERROR';
  readonly statusCode = 500;

  constructor(message: string, public readonly configKey?: string) {
    super(message, { configKey });
  }

  getUserMessage(): string {
    return 'Uygulama yapılandırma hatası. Lütfen yöneticiye başvurun.';
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends AppError {
  readonly code = 'AUTHENTICATION_ERROR';
  readonly statusCode = 401;

  getUserMessage(): string {
    return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends AppError {
  readonly code = 'AUTHORIZATION_ERROR';
  readonly statusCode = 403;

  getUserMessage(): string {
    return 'Bu işlem için yetkiniz bulunmuyor.';
  }
}

/**
 * Data processing errors
 */
export class DataProcessingError extends AppError {
  readonly code = 'DATA_PROCESSING_ERROR';
  readonly statusCode = 422;

  getUserMessage(): string {
    return 'Veri işleme hatası. Lütfen daha sonra tekrar deneyin.';
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends AppError {
  readonly code = 'TIMEOUT_ERROR';
  readonly statusCode = 408;

  constructor(message: string, public readonly timeoutMs: number) {
    super(message, { timeoutMs });
  }

  getUserMessage(): string {
    return 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.';
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends ApiError {
  readonly code = 'API_ERROR' as const;

  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(429, message, undefined, undefined);
    this.context = { retryAfter };
  }

  getUserMessage(): string {
    const retryMessage = this.retryAfter 
      ? ` ${this.retryAfter} saniye sonra tekrar deneyin.`
      : ' Lütfen biraz bekleyin.';
    return `Çok fazla istek gönderildi.${retryMessage}`;
  }
}

/**
 * Error factory for creating appropriate error types
 */
export class ErrorFactory {
  static fromHttpStatus(
    status: number,
    message: string,
    endpoint?: string,
    originalError?: Error
  ): AppError {
    switch (status) {
      case 401:
        return new AuthenticationError(message, undefined, originalError);
      case 403:
        return new AuthorizationError(message, undefined, originalError);
      case 408:
        return new TimeoutError(message, 0);
      case 422:
        return new DataProcessingError(message, undefined, originalError);
      case 429:
        return new RateLimitError(message);
      default:
        return new ApiError(status, message, endpoint, originalError);
    }
  }

  static fromFetchError(error: Error, endpoint?: string): AppError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError('Network request failed', error);
    }
    
    if (error.message.includes('timeout')) {
      return new TimeoutError('Request timeout', 0);
    }
    
    return new ApiError(0, error.message, endpoint, error);
  }
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error context for better debugging
 */
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: Date;
  severity: ErrorSeverity;
  tags?: string[];
}

/**
 * Error reporter interface
 */
export interface ErrorReporter {
  report(error: AppError, context: ErrorContext): Promise<void>;
}

/**
 * Console error reporter for development
 */
export class ConsoleErrorReporter implements ErrorReporter {
  async report(error: AppError, context: ErrorContext): Promise<void> {
    const logLevel = this.getLogLevel(context.severity);
    const logData = {
      error: error.toJSON(),
      context,
      userMessage: error.getUserMessage()
    };
    
    console[logLevel]('Error Report:', logData);
  }

  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
    }
  }
}

/**
 * Error manager for centralized error handling
 */
export class ErrorManager {
  private reporters: ErrorReporter[] = [];
  private static instance: ErrorManager;

  private constructor() {
    // Add default console reporter in development
    if (import.meta.env.DEV) {
      this.reporters.push(new ConsoleErrorReporter());
    }
  }

  static getInstance(): ErrorManager {
    if (!ErrorManager.instance) {
      ErrorManager.instance = new ErrorManager();
    }
    return ErrorManager.instance;
  }

  addReporter(reporter: ErrorReporter): void {
    this.reporters.push(reporter);
  }

  async handleError(
    error: Error | AppError,
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    const appError = error instanceof AppError 
      ? error 
      : new DataProcessingError(error.message, undefined, error);

    const fullContext: ErrorContext = {
      timestamp: new Date(),
      severity: this.determineSeverity(appError),
      url: window?.location?.href,
      userAgent: navigator?.userAgent,
      ...context
    };

    // Report to all registered reporters
    await Promise.all(
      this.reporters.map(reporter => 
        reporter.report(appError, fullContext).catch(console.error)
      )
    );
  }

  private determineSeverity(error: AppError): ErrorSeverity {
    switch (error.code) {
      case 'CONFIGURATION_ERROR':
        return ErrorSeverity.CRITICAL;
      case 'AUTHENTICATION_ERROR':
      case 'AUTHORIZATION_ERROR':
        return ErrorSeverity.HIGH;
      case 'API_ERROR':
        return error.statusCode >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM;
      case 'NETWORK_ERROR':
      case 'TIMEOUT_ERROR':
        return ErrorSeverity.MEDIUM;
      case 'VALIDATION_ERROR':
      case 'RATE_LIMIT_ERROR':
        return ErrorSeverity.LOW;
      default:
        return ErrorSeverity.MEDIUM;
    }
  }
}

/**
 * Global error manager instance
 */
export const errorManager = ErrorManager.getInstance();