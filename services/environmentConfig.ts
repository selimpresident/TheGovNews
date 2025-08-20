/**
 * Environment Configuration Service
 * Provides type-safe access to environment variables with validation
 */

export interface EnvironmentConfig {
  geminiApiKey: string;
  apiBaseUrl: string;
  enableDebugMode: boolean;
  isDevelopment: boolean;
}

export interface ConfigValidationResult {
  isValid: boolean;
  missingKeys: string[];
  errors: string[];
}

class EnvironmentConfigService {
  private config: EnvironmentConfig | null = null;
  private validationResult: ConfigValidationResult | null = null;

  /**
   * Initialize and validate environment configuration
   */
  public initialize(): ConfigValidationResult {
    const missingKeys: string[] = [];
    const errors: string[] = [];

    // Check for required environment variables
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      missingKeys.push('VITE_GEMINI_API_KEY');
    }

    // Validate API key format (basic validation)
    if (geminiApiKey && !this.isValidApiKey(geminiApiKey)) {
      errors.push('VITE_GEMINI_API_KEY appears to be invalid format');
    }

    // Set default values for optional configurations
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';
    const enableDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
    const isDevelopment = import.meta.env.DEV === true;

    this.validationResult = {
      isValid: missingKeys.length === 0 && errors.length === 0,
      missingKeys,
      errors
    };

    if (this.validationResult.isValid) {
      this.config = {
        geminiApiKey: geminiApiKey!,
        apiBaseUrl,
        enableDebugMode,
        isDevelopment
      };
    }

    return this.validationResult;
  }

  /**
   * Get the validated configuration
   * Throws error if configuration is not valid
   */
  public getConfig(): EnvironmentConfig {
    if (!this.config || !this.validationResult?.isValid) {
      throw new Error(
        'Environment configuration is not valid. Call initialize() first and check validation result.'
      );
    }
    return this.config;
  }

  /**
   * Get validation result
   */
  public getValidationResult(): ConfigValidationResult | null {
    return this.validationResult;
  }

  /**
   * Basic API key format validation
   */
  private isValidApiKey(apiKey: string): boolean {
    // Basic validation - should start with expected prefix and have minimum length
    if (!apiKey || typeof apiKey !== 'string') return false;
    return apiKey.startsWith('AIza') && apiKey.length >= 35 && apiKey.length <= 50;
  }

  /**
   * Get configuration with fallback for development
   */
  public getConfigWithFallback(): EnvironmentConfig {
    try {
      return this.getConfig();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Using fallback configuration for development');
        return {
          geminiApiKey: 'development-key',
          apiBaseUrl: 'http://localhost:3000',
          enableDebugMode: true,
          isDevelopment: true
        };
      }
      throw error;
    }
  }
}

// Export singleton instance
export const environmentConfig = new EnvironmentConfigService();

/**
 * Initialize environment configuration at application startup
 * This should be called before any other services that depend on configuration
 */
export function initializeEnvironmentConfig(): void {
  const result = environmentConfig.initialize();
  
  if (!result.isValid) {
    const errorMessage = [
      'Environment configuration validation failed:',
      ...result.missingKeys.map(key => `- Missing required environment variable: ${key}`),
      ...result.errors.map(error => `- ${error}`),
      '',
      'Please check your .env file and ensure all required variables are set.'
    ].join('\n');
    
    console.error(errorMessage);
    
    // In production, throw error to prevent startup with invalid config
    if (!import.meta.env.DEV) {
      throw new Error('Invalid environment configuration');
    }
  } else {
    console.log('Environment configuration validated successfully');
  }
}