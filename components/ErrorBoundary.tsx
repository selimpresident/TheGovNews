/**
 * React Error Boundary Component
 * Catches and handles React component errors gracefully
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppError, DataProcessingError, errorManager, ErrorSeverity } from '../utils/errors';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorId: string, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'feature';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error info
    this.setState({ errorInfo });

    // Report error to centralized error manager
    const appError = error instanceof AppError 
      ? error 
      : new DataProcessingError(
          `React component error: ${error.message}`,
          undefined,
          error
        );

    errorManager.handleError(appError, {
      severity: this.getErrorSeverity(),
      tags: ['react-error-boundary', this.props.level || 'component'],
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private getErrorSeverity(): ErrorSeverity {
    switch (this.props.level) {
      case 'page':
        return ErrorSeverity.HIGH;
      case 'feature':
        return ErrorSeverity.MEDIUM;
      case 'component':
      default:
        return ErrorSeverity.LOW;
    }
  }

  private handleRetry = () => {
    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Add a small delay to prevent immediate re-error
    this.retryTimeoutId = window.setTimeout(() => {
      // Reset error state
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
    }, 100);
  };

  private handleReload = () => {
    window.location.reload();
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError && this.state.error && this.state.errorId) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorId, this.handleRetry);
      }

      // Default error UI based on level
      return this.renderDefaultErrorUI();
    }

    return this.props.children;
  }

  private renderDefaultErrorUI() {
    const { level = 'component' } = this.props;
    const { error, errorId } = this.state;

    if (level === 'page') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Tekrar Dene
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Sayfayı Yenile
              </button>
            </div>
            {import.meta.env.DEV && (
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-gray-500 dark:text-gray-400">
                  Hata Detayları (Geliştirici)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto">
                  {error?.stack}
                </pre>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Hata ID: {errorId}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    if (level === 'feature') {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Özellik Yüklenemedi
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                Bu bölüm şu anda kullanılamıyor. Lütfen tekrar deneyin.
              </p>
              <div className="mt-3">
                <button
                  onClick={this.handleRetry}
                  className="text-sm bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200 font-medium py-1 px-3 rounded transition-colors"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Component level error
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
        <div className="flex items-center">
          <svg className="h-4 w-4 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
          </svg>
          <span className="text-sm text-yellow-800 dark:text-yellow-200">
            Bileşen yüklenemedi
          </span>
          <button
            onClick={this.handleRetry}
            className="ml-auto text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 underline"
          >
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Hook for handling errors in functional components
 */
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, context?: Record<string, unknown>) => {
    const appError = error instanceof AppError 
      ? error 
      : new DataProcessingError(error.message, undefined, error);

    errorManager.handleError(appError, {
      severity: ErrorSeverity.MEDIUM,
      tags: ['react-hook'],
      ...context
    });
  }, []);

  return handleError;
}