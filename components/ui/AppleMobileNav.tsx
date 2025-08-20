/**
 * Apple HIG Compliant Mobile Navigation
 * Follows iOS tab bar and navigation patterns with golden ratio proportions
 */

import React, { memo, useCallback, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface AppleMobileNavProps {
  items: NavItem[];
  activeItem: string;
  onItemSelect: (itemId: string) => void;
  className?: string;
}

/**
 * iOS-style tab bar item with haptic feedback simulation
 */
const TabBarItem: React.FC<{
  item: NavItem;
  isActive: boolean;
  onSelect: () => void;
}> = memo(({ item, isActive, onSelect }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    onSelect();
  }, [onSelect]);

  return (
    <button
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      disabled={item.disabled}
      className={`
        relative flex flex-col items-center justify-center
        flex-1 py-2 px-1
        transition-all duration-200 ease-out
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${item.disabled ? 'opacity-40' : 'opacity-100'}
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-inset
        rounded-lg
      `}
      style={{
        // Golden ratio height: 49px (iOS standard tab bar height)
        minHeight: '49px'
      }}
    >
      {/* Icon Container */}
      <div 
        className={`
          flex items-center justify-center mb-1
          transition-all duration-200 ease-out
          ${isActive 
            ? 'text-blue-600 dark:text-blue-400 scale-110' 
            : 'text-gray-500 dark:text-gray-400 scale-100'
          }
        `}
        style={{
          // Icon size: 25px (iOS standard)
          width: '25px',
          height: '25px'
        }}
      >
        {item.icon}
        
        {/* Badge */}
        {item.badge && item.badge > 0 && (
          <div 
            className="
              absolute -top-1 -right-1
              bg-red-500 text-white text-xs font-medium
              rounded-full min-w-[18px] h-[18px]
              flex items-center justify-center
              border-2 border-white dark:border-gray-900
            "
            style={{
              fontSize: '11px', // iOS badge font size
              lineHeight: '1'
            }}
          >
            {item.badge > 99 ? '99+' : item.badge}
          </div>
        )}
      </div>

      {/* Label */}
      <span 
        className={`
          text-xs font-medium tracking-tight
          transition-all duration-200 ease-out
          ${isActive 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-gray-500 dark:text-gray-400'
          }
        `}
        style={{
          fontSize: '10px', // iOS tab bar label size
          lineHeight: '12px'
        }}
      >
        {item.label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div 
          className="
            absolute bottom-0 left-1/2 transform -translate-x-1/2
            w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full
            transition-all duration-200 ease-out
          "
        />
      )}
    </button>
  );
});

TabBarItem.displayName = 'TabBarItem';

/**
 * Apple-style mobile navigation with iOS tab bar design
 */
const AppleMobileNav: React.FC<AppleMobileNavProps> = memo(({
  items,
  activeItem,
  onItemSelect,
  className = ''
}) => {
  return (
    <nav 
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white/95 dark:bg-gray-900/95
        backdrop-blur-xl backdrop-saturate-150
        border-t border-gray-200/50 dark:border-gray-800/50
        supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-gray-900/80
        ${className}
      `}
      style={{
        // iOS safe area consideration
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        // Golden ratio height: 49px + safe area
        minHeight: '49px'
      }}
    >
      <div className="flex items-stretch">
        {items.map((item) => (
          <TabBarItem
            key={item.id}
            item={item}
            isActive={activeItem === item.id}
            onSelect={() => onItemSelect(item.id)}
          />
        ))}
      </div>

      {/* iOS-style top border with subtle gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
    </nav>
  );
});

AppleMobileNav.displayName = 'AppleMobileNav';

export default AppleMobileNav;

/**
 * Common icons for mobile navigation (iOS style)
 */
export const NavIcons = {
  Home: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path 
        d="M3 9.5L12.5 2L22 9.5V20.5C22 21.6 21.1 22.5 20 22.5H5C3.9 22.5 3 21.6 3 20.5V9.5Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <path 
        d="M9 22.5V12.5H16V22.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),
  
  Search: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <circle 
        cx="11" 
        cy="11" 
        r="8" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M21 21L16.65 16.65" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  ),
  
  Bookmark: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path 
        d="M19 21L12.5 16L6 21V5C6 3.9 6.9 3 8 3H17C18.1 3 19 3.9 19 5V21Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),
  
  Profile: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path 
        d="M20 21V19C20 17.9 19.6 16.9 18.9 16.1C18.2 15.4 17.1 15 16 15H9C7.9 15 6.8 15.4 6.1 16.1C5.4 16.9 5 17.9 5 19V21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle 
        cx="12.5" 
        cy="7" 
        r="4" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
    </svg>
  ),
  
  Settings: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <circle 
        cx="12.5" 
        cy="12.5" 
        r="3" 
        stroke="currentColor" 
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M19.4 15C19.2 15.3 19.1 15.7 19.1 16.1C19.1 16.5 19.2 16.9 19.4 17.2L20.9 19.4C21.1 19.7 21 20.1 20.7 20.3L19.3 21.7C19 22 18.6 22.1 18.3 21.9L16.1 20.4C15.8 20.6 15.4 20.7 15 20.7C14.6 20.7 14.2 20.6 13.9 20.4L11.7 21.9C11.4 22.1 11 22 10.8 21.7L9.4 20.3C9.1 20 9 19.6 9.2 19.3L10.7 17.1C10.5 16.8 10.4 16.4 10.4 16C10.4 15.6 10.5 15.2 10.7 14.9L9.2 12.7C9 12.4 9.1 12 9.4 11.8L10.8 10.4C11.1 10.1 11.5 10 11.8 10.2L14 11.7C14.3 11.5 14.7 11.4 15.1 11.4C15.5 11.4 15.9 11.5 16.2 11.7L18.4 10.2C18.7 10 19.1 10.1 19.3 10.4L20.7 11.8C21 12.1 21.1 12.5 20.9 12.8L19.4 15Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
};