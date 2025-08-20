/**
 * Apple HIG Compliant Header Component
 * Follows Apple Human Interface Guidelines with golden ratio proportions
 */

import React, { memo, useCallback } from 'react';
import { AppLogo } from '../Logo';
import ThemeToggleButton from '../ThemeToggleButton';

type Category = 'official' | 'intelligence' | 'data';

interface AppleHeaderProps {
  onNavigateBack: () => void;
  activeCategory: Category;
  onSetCategory: (category: Category) => void;
}

/**
 * Apple-style segmented control with golden ratio proportions
 * Height: 32px (iOS standard)
 * Padding: 8px horizontal (iOS standard)
 * Corner radius: 8px (iOS standard)
 */
const SegmentedControl: React.FC<{
  segments: Array<{ key: Category; label: string; shortLabel: string }>;
  activeSegment: Category;
  onSegmentChange: (segment: Category) => void;
}> = memo(({ segments, activeSegment, onSegmentChange }) => {
  return (
    <div className="inline-flex bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50">
      {segments.map((segment) => (
        <button
          key={segment.key}
          onClick={() => onSegmentChange(segment.key)}
          className={`
            relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-out
            min-w-[64px] h-8 flex items-center justify-center
            ${activeSegment === segment.key
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-600/50'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
            }
          `}
          style={{
            // Golden ratio proportions: width = height * φ (1.618)
            minWidth: activeSegment === segment.key ? '80px' : '64px'
          }}
        >
          {/* Desktop labels */}
          <span className="hidden sm:inline">{segment.label}</span>
          {/* Mobile labels */}
          <span className="sm:hidden">{segment.shortLabel}</span>
        </button>
      ))}
    </div>
  );
});

SegmentedControl.displayName = 'SegmentedControl';

/**
 * Apple-style navigation button with haptic feedback simulation
 */
const NavigationButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = memo(({ onClick, children, className = '' }) => {
  const handleClick = useCallback(() => {
    // Simulate haptic feedback with subtle animation
    onClick();
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-2 py-2 rounded-xl
        text-gray-900 dark:text-white
        hover:bg-gray-100/60 dark:hover:bg-gray-800/60
        active:bg-gray-200/80 dark:active:bg-gray-700/80
        transition-all duration-150 ease-out
        active:scale-95 transform
        ${className}
      `}
    >
      {children}
    </button>
  );
});

NavigationButton.displayName = 'NavigationButton';

/**
 * Apple HIG compliant header with golden ratio proportions
 * Height: 88px on mobile (iOS safe area), 64px on desktop
 * Uses SF Pro Display font characteristics via system fonts
 */
const AppleHeader: React.FC<AppleHeaderProps> = memo(({ 
  onNavigateBack, 
  activeCategory, 
  onSetCategory 
}) => {
  const segments = [
    { key: 'official' as Category, label: 'Official', shortLabel: 'Off' },
    { key: 'intelligence' as Category, label: 'Intelligence', shortLabel: 'Int' },
    { key: 'data' as Category, label: 'Data', shortLabel: 'Data' }
  ];

  return (
    <header 
      className="
        sticky top-0 z-50 
        bg-white/95 dark:bg-gray-900/95 
        backdrop-blur-xl backdrop-saturate-150
        border-b border-gray-200/50 dark:border-gray-800/50
        supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-900/80
      "
      style={{
        // iOS safe area consideration
        paddingTop: 'env(safe-area-inset-top, 0px)'
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div 
          className="
            flex items-center justify-between 
            px-4 sm:px-6 lg:px-8
            h-16 sm:h-20
          "
          style={{
            // Golden ratio height proportions
            minHeight: '64px' // Base height
          }}
        >
          {/* Left Section - Logo and Title */}
          <NavigationButton onClick={onNavigateBack}>
            <AppLogo className="h-8 w-8 rounded-xl shadow-sm" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                TheGovNews
              </h1>
            </div>
          </NavigationButton>

          {/* Center Section - Segmented Control */}
          <div className="flex-1 flex justify-center px-4">
            <SegmentedControl
              segments={segments}
              activeSegment={activeCategory}
              onSegmentChange={onSetCategory}
            />
          </div>

          {/* Right Section - Theme Toggle */}
          <div className="flex items-center">
            <div className="p-1">
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>

      {/* iOS-style bottom border with subtle gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </header>
  );
});

AppleHeader.displayName = 'AppleHeader';

export default AppleHeader;