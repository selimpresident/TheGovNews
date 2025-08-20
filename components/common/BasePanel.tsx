/**
 * BasePanel Component
 * Modern, reusable panel component with enhanced design and animations
 */

import React, { ReactNode, useState } from 'react';
import { Spinner } from '../Spinner';

export type PanelVariant = 'default' | 'glass' | 'filled' | 'outlined' | 'gradient' | 'neumorphic';
export type PanelSize = 'sm' | 'md' | 'lg';

export interface BasePanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  loading?: boolean;
  error?: string | null;
  onRefresh?: (() => void) | undefined;
  className?: string;
  variant?: PanelVariant;
  size?: PanelSize;
  headerActions?: ReactNode;
  footerContent?: ReactNode;
  children: ReactNode;
}

export const BasePanel: React.FC<BasePanelProps> = ({
  title,
  subtitle,
  icon,
  loading = false,
  error = null,
  onRefresh,
  className = '',
  variant = 'default',
  size = 'md',
  headerActions,
  footerContent,
  children,
}) => {
  // Panel variant styles with enhanced modern design options
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-slate-700/50',
    filled: 'bg-slate-50 dark:bg-slate-900 border border-transparent',
    outlined: 'bg-transparent border border-slate-200 dark:border-slate-700',
    gradient: 'bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-white/20 dark:border-slate-700/50',
    neumorphic: 'bg-slate-100 dark:bg-slate-800 border-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),_0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_1px_2px_rgba(0,0,0,0.3)]',
  };

  // Panel size styles are defined in headerSizeStyles and contentSizeStyles below

  // Header size styles
  const headerSizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Content size styles
  const contentSizeStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Track hover state for enhanced interactions
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`rounded-xl overflow-hidden transition-all duration-300 ${variantStyles[variant]} ${className} ${
        variant !== 'neumorphic' ? 'shadow-lg hover:shadow-xl' : ''
      }`}
      data-testid="base-panel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Panel Header with enhanced styling */}
      <div className={`border-b border-slate-200/70 dark:border-slate-700/50 ${headerSizeStyles[size]} flex items-center justify-between transition-colors duration-300 ${isHovered ? 'bg-slate-50/50 dark:bg-slate-700/30' : ''}`}>
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-full bg-slate-100 dark:bg-slate-700 transition-transform duration-300 ${isHovered ? 'scale-105' : ''}">
              {icon}
            </div>
          )}
          <div className="transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 transition-colors">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{subtitle}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {headerActions}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700/50 disabled:opacity-50 transition-all duration-300 hover:scale-110"
              aria-label="Refresh data"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Panel Content with enhanced styling */}
      <div className={`${contentSizeStyles[size]} transition-colors duration-300 ${isHovered ? 'bg-white/50 dark:bg-slate-800/50' : ''}`}>
        {loading ? (
          <div className="flex justify-center items-center py-12 transition-opacity duration-300">
            <Spinner className="animate-pulse" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
              Error Loading Data
            </h3>
            <p className="text-xs text-red-600 dark:text-red-400 mb-3">
              {error}
            </p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-1.5 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>

      {/* Panel Footer with enhanced styling */}
      {footerContent && (
        <div className={`border-t border-slate-200/70 dark:border-slate-700/50 ${headerSizeStyles[size]} transition-colors duration-300 ${isHovered ? 'bg-slate-50/50 dark:bg-slate-700/30' : ''}`}>
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default BasePanel;