/**
 * Generic Data Panel Component
 * Provides consistent loading, error, and data display patterns with modern animations
 */

import React, { ReactNode, useState } from 'react';
import { Spinner } from '../Spinner';

export interface DataPanelProps<T> {
  title: string;
  data: T | null;
  loading: boolean;
  error: string | null;
  children: (data: T) => ReactNode;
  onRefresh?: () => void;
  className?: string;
  emptyMessage?: string;
  errorTitle?: string;
}

export function DataPanel<T>({
  title,
  data,
  loading,
  error,
  children,
  onRefresh,
  className = '',
  emptyMessage = 'No data available',
  errorTitle = 'Error loading data'
}: DataPanelProps<T>) {
  // Track hover state for enhanced interactions
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = "bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden";
  
  return (
    <div 
      className={`${baseClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with enhanced styling */}
      <div className={`p-4 border-b border-slate-200/70 dark:border-slate-700/50 flex items-center justify-between transition-colors duration-300 ${isHovered ? 'bg-slate-50/50 dark:bg-slate-700/30' : ''}`}>
        <h2 className={`text-lg font-semibold text-slate-800 dark:text-slate-100 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
          {title}
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 disabled:opacity-50 transition-all duration-300 hover:scale-110"
            aria-label="Refresh data"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Content with enhanced styling */}
      <div className={`flex-1 transition-colors duration-300 ${isHovered ? 'bg-white/50 dark:bg-slate-800/50' : ''}`}>
        {loading ? (
          <div className="flex justify-center items-center h-40 transition-opacity duration-300">
            <Spinner className="animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-40 text-center p-6 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3 animate-pulse">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
              {errorTitle}
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 mb-3">
              {error}
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Try Again
              </button>
            )}
          </div>
        ) : data ? (
          children(data)
        ) : (
          <div className="flex flex-col justify-center items-center h-40 text-center p-6 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 transition-transform duration-300 hover:scale-110">
              <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Higher-order component for wrapping existing panels with DataPanel
 */
export function withDataPanel<T, P extends { data: T | null; loading?: boolean; error?: string | null }>(
  Component: React.ComponentType<P>,
  title: string,
  options: {
    emptyMessage?: string;
    errorTitle?: string;
    className?: string;
  } = {}
) {
  const WrappedComponent = (props: P) => {
    const { data, loading = false, error = null, ...restProps } = props;
    
    return (
      <DataPanel
        title={title}
        data={data}
        loading={loading}
        error={error}
        {...options}
      >
        {(data) => <Component {...(restProps as P)} data={data} />}
      </DataPanel>
    );
  };

  WrappedComponent.displayName = `withDataPanel(${Component.displayName || Component.name})`;
  return WrappedComponent;
}