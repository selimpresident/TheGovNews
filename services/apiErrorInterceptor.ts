/**
 * API Error Interceptor Service
 * Provides standardized error handling for all API calls
 */

import {
    ApiError,
    TimeoutError,
    RateLimitError,
    ErrorFactory,
    errorManager,
    ErrorSeverity
} from '../utils/errors';

/**
 * API call options
 */
export interface ApiCallOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    skipErrorReporting?: boolean;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
}

/**
 * Retry configuration
 */
interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    retryableStatuses: number[];
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    retryableStatuses: [408, 429, 500, 502, 503, 504]
};

/**
 * API Error Interceptor Class
 */
export class ApiErrorInterceptor {
    private retryConfig: RetryConfig;

    constructor(retryConfig: Partial<RetryConfig> = {}) {
        this.retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    }

    /**
     * Enhanced fetch with error handling and retries
     */
    async fetch<T>(
        url: string,
        options: ApiCallOptions = {}
    ): Promise<ApiResponse<T>> {
        const {
            timeout = 30000,
            retries = this.retryConfig.maxRetries,
            retryDelay = this.retryConfig.baseDelay,
            skipErrorReporting = false,
            ...fetchOptions
        } = options;

        let lastError: Error | null = null;
        let attempt = 0;

        while (attempt <= retries) {
            try {
                const response = await this.performRequest<T>(url, fetchOptions, timeout);

                // If successful, return the response
                if (response.status >= 200 && response.status < 300) {
                    return response;
                }

                // Handle HTTP error responses
                const error = await this.createErrorFromResponse(response, url);

                // Check if we should retry
                if (attempt < retries && this.shouldRetry(response.status)) {
                    attempt++;
                    await this.delay(this.calculateRetryDelay(attempt, retryDelay));
                    continue;
                }

                // Report error if not skipped
                if (!skipErrorReporting) {
                    await errorManager.handleError(error, {
                        severity: this.getErrorSeverity(response.status),
                        tags: ['api-call', 'http-error'],
                        url
                    });
                }

                throw error;

            } catch (error) {
                lastError = error as Error;

                // Handle network errors
                if (this.isNetworkError(error as Error)) {
                    const networkError = ErrorFactory.fromFetchError(error as Error, url);

                    if (attempt < retries) {
                        attempt++;
                        await this.delay(this.calculateRetryDelay(attempt, retryDelay));
                        continue;
                    }

                    if (!skipErrorReporting) {
                        await errorManager.handleError(networkError, {
                            severity: ErrorSeverity.MEDIUM,
                            tags: ['api-call', 'network-error']
                        });
                    }

                    throw networkError;
                }

                // Re-throw non-retryable errors
                throw error;
            }
        }

        // If we've exhausted all retries
        if (lastError) {
            throw lastError;
        }

        throw new ApiError(0, 'Unknown error occurred', url);
    }

    /**
     * Perform the actual HTTP request with timeout
     */
    private async performRequest<T>(
        url: string,
        options: RequestInit,
        timeout: number
    ): Promise<ApiResponse<T>> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Parse response data
            let data: T;
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text() as unknown as T;
            }

            return {
                data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            };

        } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error && error.name === 'AbortError') {
                throw new TimeoutError(`Request timeout after ${timeout}ms`, timeout);
            }

            throw error;
        }
    }

    /**
     * Create appropriate error from HTTP response
     */
    private async createErrorFromResponse(
        response: ApiResponse<unknown>,
        url: string
    ): Promise<ApiError> {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        // Try to extract error message from response body
        try {
            if (typeof response.data === 'object' && response.data !== null) {
                const errorData = response.data as Record<string, unknown>;
                if (typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                } else if (typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                }
            }
        } catch {
            // Ignore parsing errors, use default message
        }

        // Handle specific status codes
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
            return new RateLimitError(errorMessage, retryAfterSeconds);
        }

        return new ApiError(response.status, errorMessage, url);
    }

    /**
     * Check if error is a network error
     */
    private isNetworkError(error: Error): boolean {
        return (
            error.name === 'TypeError' ||
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('Failed to fetch')
        );
    }

    /**
     * Determine if we should retry based on status code
     */
    private shouldRetry(status: number): boolean {
        return this.retryConfig.retryableStatuses.includes(status);
    }

    /**
     * Calculate retry delay with exponential backoff
     */
    private calculateRetryDelay(attempt: number, baseDelay: number): number {
        const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.1 * exponentialDelay;
        return Math.min(exponentialDelay + jitter, this.retryConfig.maxDelay);
    }

    /**
     * Delay utility
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get error severity based on HTTP status
     */
    private getErrorSeverity(status: number): ErrorSeverity {
        if (status >= 500) return ErrorSeverity.HIGH;
        if (status >= 400) return ErrorSeverity.MEDIUM;
        return ErrorSeverity.LOW;
    }
}

/**
 * Global API interceptor instance
 */
export const apiInterceptor = new ApiErrorInterceptor();

/**
 * Convenience function for making API calls with error handling
 */
export async function apiCall<T>(
    url: string,
    options?: ApiCallOptions
): Promise<T> {
    const response = await apiInterceptor.fetch<T>(url, options);
    return response.data;
}

/**
 * Convenience functions for different HTTP methods
 */
export const api = {
    get: <T>(url: string, options?: Omit<ApiCallOptions, 'method'>) =>
        apiCall<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, data?: unknown, options?: Omit<ApiCallOptions, 'method' | 'body'>) =>
        apiCall<T>(url, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers
            }
        }),

    put: <T>(url: string, data?: unknown, options?: Omit<ApiCallOptions, 'method' | 'body'>) =>
        apiCall<T>(url, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers
            }
        }),

    delete: <T>(url: string, options?: Omit<ApiCallOptions, 'method'>) =>
        apiCall<T>(url, { ...options, method: 'DELETE' }),

    patch: <T>(url: string, data?: unknown, options?: Omit<ApiCallOptions, 'method' | 'body'>) =>
        apiCall<T>(url, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers
            }
        })
};