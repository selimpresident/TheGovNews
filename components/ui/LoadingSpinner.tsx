/**
 * Reusable Loading Spinner Component
 * Provides consistent loading indicators across the application
 */

import React, { memo } from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  message?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-slate-600 dark:text-slate-400',
  white: 'text-white',
  gray: 'text-gray-600 dark:text-gray-400'
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({
  size = 'md',
  color = 'primary',
  className = '',
  message,
  fullScreen = false
}) => {
  const spinnerClasses = `${sizeClasses[size]} ${colorClasses[color]} animate-spin`;
  
  const spinner = (
    <svg 
      className={`${spinnerClasses} ${className}`}
      fill="none" 
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          {message && (
            <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="flex flex-col items-center gap-3">
        {spinner}
        <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
          {message}
        </p>
      </div>
    );
  }

  return spinner;
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;

/**
 * Loading overlay component for wrapping content
 */
export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = memo(({
  loading,
  children,
  message,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
          <LoadingSpinner message={message} />
        </div>
      )}
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';

/**
 * Skeleton loader component for content placeholders
 */
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = memo(({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = false,
  animate = true
}) => {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div
      className={`
        bg-slate-200 dark:bg-slate-700 
        ${rounded ? 'rounded-full' : 'rounded'} 
        ${animate ? 'animate-pulse' : ''} 
        ${className}
      `}
      style={{ width: widthStyle, height: heightStyle }}
      aria-label="Loading content"
    />
  );
});

Skeleton.displayName = 'Skeleton';

/**
 * Card skeleton for article cards
 */
export const ArticleCardSkeleton: React.FC = memo(() => (
  <div className="p-3 border-b border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-start mb-2">
      <Skeleton width="60%" height="0.75rem" />
      <Skeleton width="1rem" height="1rem" rounded />
    </div>
    <Skeleton width="90%" height="1rem" className="mb-2" />
    <Skeleton width="100%" height="0.75rem" className="mb-2" />
    <div className="flex gap-2">
      <Skeleton width="3rem" height="1.25rem" rounded />
      <Skeleton width="4rem" height="1.25rem" rounded />
    </div>
  </div>
));

ArticleCardSkeleton.displayName = 'ArticleCardSkeleton';

/**
 * List of article skeletons
 */
export interface ArticleListSkeletonProps {
  count?: number;
}

export const ArticleListSkeleton: React.FC<ArticleListSkeletonProps> = memo(({ count = 5 }) => (
  <div className="divide-y divide-slate-200 dark:divide-slate-700">
    {Array.from({ length: count }, (_, index) => (
      <ArticleCardSkeleton key={index} />
    ))}
  </div>
));

ArticleListSkeleton.displayName = 'ArticleListSkeleton';