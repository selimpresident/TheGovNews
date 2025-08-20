/**
 * Enhanced Type Definitions
 * Provides additional type safety and utility types
 */

import { 
  Article, 
  Source, 
  Topic, 
  AiAnalysisResult,
  UcdpEvent,
  GdeltArticle,
  ExternalArticle 
} from '../types';

/**
 * Utility Types for better type safety
 */

// Make all properties required (opposite of Partial)
// Note: Using RequiredFields to avoid conflict with built-in Required
export type StrictRequired<T> = {
  [P in keyof T]-?: T[P];
};

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & StrictRequired<Pick<T, K>>;

// Make specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Extract non-nullable type
export type NonNullable<T> = T extends null | undefined ? never : T;

// Create a type with readonly properties
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends object ? Immutable<T[P]> : T[P];
};

/**
 * Enhanced Article Types
 */
export type ArticleWithRequiredSummary = RequireFields<Article, 'summary_ai'>;
export type ArticleWithRequiredAnalysis = RequireFields<Article, 'ai_analysis'>;
export type CompleteArticle = RequireFields<Article, 'summary_ai' | 'ai_analysis'>;

/**
 * API Response Types with strict validation
 */
export interface ApiSuccess<T> {
  readonly status: 'success';
  readonly data: T;
  readonly timestamp: string;
  readonly message?: string;
}

export interface ApiError {
  readonly status: 'error';
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/**
 * Paginated Response Type
 */
export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiSuccess<T[]> {
  readonly pagination: PaginationMeta;
}

/**
 * Data Loading States
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface DataState<T> {
  readonly data: T | null;
  readonly loading: LoadingState;
  readonly error: string | null;
  readonly lastFetched: Date | null;
}

/**
 * Enhanced Error Types
 */
export interface ErrorDetails {
  readonly code: string;
  readonly message: string;
  readonly field?: string;
  readonly timestamp: Date;
  readonly stack?: string;
}

export class TypedError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly field?: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'TypedError';
  }

  toDetails(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      timestamp: new Date(),
      stack: this.stack
    };
  }
}

/**
 * Configuration Types
 */
export interface StrictEnvironmentConfig {
  readonly geminiApiKey: string;
  readonly apiBaseUrl: string;
  readonly enableDebugMode: boolean;
  readonly isDevelopment: boolean;
  readonly apiTimeout: number;
  readonly maxRetries: number;
}

/**
 * Component Props Types with strict validation
 */
export interface BaseComponentProps {
  readonly className?: string;
  readonly testId?: string;
}

export interface DataComponentProps<T> extends BaseComponentProps {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
  readonly onRefresh?: () => void;
}

/**
 * Event Handler Types
 */
export type EventHandler<T = void> = (event: T) => void;
export type AsyncEventHandler<T = void> = (event: T) => Promise<void>;

/**
 * Search and Filter Types
 */
export interface SearchFilters {
  readonly query?: string;
  readonly topics?: readonly Topic[];
  readonly dateRange?: {
    readonly from: Date;
    readonly to: Date;
  };
  readonly sources?: readonly string[];
  readonly sentiment?: AiAnalysisResult['sentiment'];
}

export interface SortOptions {
  readonly field: keyof Article;
  readonly direction: 'asc' | 'desc';
}

/**
 * Cache Types
 */
export interface CacheEntry<T> {
  readonly data: T;
  readonly timestamp: Date;
  readonly expiresAt: Date;
}

export interface CacheOptions {
  readonly ttl: number; // Time to live in milliseconds
  readonly maxSize?: number;
}

/**
 * Validation Schema Types
 */
export interface ValidationSchema<T> {
  readonly validate: (data: unknown) => data is T;
  readonly sanitize?: (data: T) => T;
  readonly transform?: (data: unknown) => T;
}

/**
 * Type Guards for Runtime Validation
 */
export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.status === 'success';
}

export function isApiError(response: ApiResponse<unknown>): response is ApiError {
  return response.status === 'error';
}

export function isLoadingState(state: string): state is LoadingState {
  return ['idle', 'loading', 'success', 'error'].includes(state);
}

/**
 * Branded Types for ID validation
 */
export type ArticleId = string & { readonly __brand: 'ArticleId' };
export type SourceId = string & { readonly __brand: 'SourceId' };
export type UserId = string & { readonly __brand: 'UserId' };

export function createArticleId(id: string): ArticleId {
  if (!id || id.trim().length === 0) {
    throw new TypedError('INVALID_ARTICLE_ID', 'Article ID cannot be empty');
  }
  return id as ArticleId;
}

export function createSourceId(id: string): SourceId {
  if (!id || id.trim().length === 0) {
    throw new TypedError('INVALID_SOURCE_ID', 'Source ID cannot be empty');
  }
  return id as SourceId;
}

/**
 * Immutable Data Helpers
 */
export function makeImmutable<T>(obj: T): Immutable<T> {
  return Object.freeze(obj) as Immutable<T>;
}

export function deepFreeze<T>(obj: T): Immutable<T> {
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj) as Immutable<T>;
}