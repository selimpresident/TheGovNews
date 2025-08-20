/**
 * Reusable Error Message Component
 * Provides consistent error display patterns across the application
 */

import React, { memo, useCallback } from 'react';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const typeStyles = {
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300',
    button: 'bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-800 dark:text-red-200'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300',
    button: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300',
    button: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200'
  }
};

const sizeStyles = {
  sm: {
    container: 'p-3',
    icon: 'w-4 h-4',
    title: 'text-sm font-medium',
    message: 'text-xs',
    button: 'px-2 py-1 text-xs'
  },
  md: {
    container: 'p-4',
    icon: 'w-5 h-5',
    title: 'text-sm font-medium',
    message: 'text-sm',
    button: 'px-3 py-1 text-sm'
  },
  lg: {
    container: 'p-6',
    icon: 'w-6 h-6',
    title: 'text-base font-semibold',
    message: 'text-sm',
    button: 'px-4 py-2 text-sm'
  }
};

const ErrorIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const WarningIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const InfoIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ErrorMessage: React.FC<ErrorMessageProps> = memo(({
  title,
  message,
  type = 'error',
  size = 'md',
  showIcon = true,
  onRetry,
  onDismiss,
  className = '',
  fullWidth = false
}) => {
  const styles = typeStyles[type];
  const sizes = sizeStyles[size];

  const handleRetry = useCallback(() => {
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  const IconComponent = type === 'warning' ? WarningIcon : type === 'info' ? InfoIcon : ErrorIcon;

  return (
    <div className={`
      ${styles.container} 
      border rounded-lg 
      ${fullWidth ? 'w-full' : ''} 
      ${className}
    `}>
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0">
            <IconComponent className={`${sizes.icon} ${styles.icon}`} />
          </div>
        )}
        
        <div className={`${showIcon ? 'ml-3' : ''} flex-1`}>
          {title && (
            <h3 className={`${sizes.title} ${styles.title} mb-1`}>
              {title}
            </h3>
          )}
          <p className={`${sizes.message} ${styles.message}`}>
            {message}
          </p>
          
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <button
                  onClick={handleRetry}
                  className={`
                    ${sizes.button} ${styles.button} 
                    font-medium rounded transition-colors
                  `}
                >
                  Tekrar Dene
                </button>
              )}
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="flex-shrink-0 ml-3">
            <button
              onClick={handleDismiss}
              className={`
                ${styles.icon} hover:opacity-75 transition-opacity
                p-1 rounded
              `}
              aria-label="Dismiss"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;

/**
 * Centered error message for full-screen errors
 */
export interface CenteredErrorProps extends Omit<ErrorMessageProps, 'fullWidth'> {
  minHeight?: string;
}

export const CenteredError: React.FC<CenteredErrorProps> = memo(({
  minHeight = '40vh',
  ...props
}) => (
  <div 
    className="flex items-center justify-center p-8"
    style={{ minHeight }}
  >
    <div className="max-w-md w-full">
      <ErrorMessage {...props} fullWidth />
    </div>
  </div>
));

CenteredError.displayName = 'CenteredError';

/**
 * Inline error message for form fields
 */
export interface InlineErrorProps {
  message: string;
  className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = memo(({
  message,
  className = ''
}) => (
  <p className={`text-sm text-red-600 dark:text-red-400 mt-1 ${className}`}>
    {message}
  </p>
));

InlineError.displayName = 'InlineError';

/**
 * Error boundary fallback component
 */
export interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  errorId?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = memo(({
  error,
  resetError,
  errorId
}) => (
  <CenteredError
    title="Bir Hata Oluştu"
    message={error.message || 'Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.'}
    type="error"
    size="lg"
    onRetry={resetError}
    className="max-w-lg"
  />
));

ErrorFallback.displayName = 'ErrorFallback';