import { useEffect, useState } from 'react';

// Enhanced breakpoints aligned with modern device sizes
export const breakpoints = {
  xs: 320,   // Small phones (iPhone SE)
  sm: 640,   // Large phones (iPhone 12/13)
  md: 768,   // Small tablets (iPad mini)
  lg: 1024,  // Large tablets/small laptops (iPad Pro)
  xl: 1280,  // Laptops/desktops
  '2xl': 1536, // Large screens
  '3xl': 1920  // Ultra-wide screens
};

// Touch-friendly minimum sizes
export const touchTargets = {
  minimum: 44,    // iOS HIG minimum
  comfortable: 48, // Material Design recommended
  large: 56       // For primary actions
};

// Container max widths for responsive design
export const containers = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
  full: '100%'
};

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<string>('');
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Set breakpoint based on window width
      if (window.innerWidth < breakpoints.sm) {
        setBreakpoint('xs');
      } else if (window.innerWidth < breakpoints.md) {
        setBreakpoint('sm');
      } else if (window.innerWidth < breakpoints.lg) {
        setBreakpoint('md');
      } else if (window.innerWidth < breakpoints.xl) {
        setBreakpoint('lg');
      } else if (window.innerWidth < breakpoints['2xl']) {
        setBreakpoint('xl');
      } else if (window.innerWidth < breakpoints['3xl']) {
        setBreakpoint('2xl');
      } else {
        setBreakpoint('3xl');
      }
    }
    
    // Add event listener with passive option for better performance
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  return { breakpoint, dimensions };
}

export function isMobile() {
  return window.innerWidth < breakpoints.md;
}

export function isTablet() {
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
}

export function isDesktop() {
  return window.innerWidth >= breakpoints.lg;
}

// Enhanced device detection
export function isSmallMobile() {
  return window.innerWidth < breakpoints.sm;
}

export function isLargeMobile() {
  return window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.md;
}

export function isSmallTablet() {
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
}

export function isLargeTablet() {
  return window.innerWidth >= breakpoints.lg && window.innerWidth < breakpoints.xl;
}

export function isUltraWide() {
  return window.innerWidth >= breakpoints['3xl'];
}

// Orientation detection
export function isLandscape() {
  return window.innerWidth > window.innerHeight;
}

export function isPortrait() {
  return window.innerWidth <= window.innerHeight;
}

// Touch device detection
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Safe area utilities for mobile devices
export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
  };
}

// Responsive grid columns calculator
export function getResponsiveColumns(baseColumns: number, breakpoint: string): number {
  switch (breakpoint) {
    case 'xs':
      return 1;
    case 'sm':
      return Math.min(2, baseColumns);
    case 'md':
      return Math.min(3, baseColumns);
    case 'lg':
      return Math.min(4, baseColumns);
    case 'xl':
      return Math.min(6, baseColumns);
    default:
      return baseColumns;
  }
}

// Container width utilities
export function getContainerClass(size: keyof typeof containers = 'xl'): string {
  return `max-w-${size === 'full' ? 'full' : `screen-${size}`} mx-auto px-4 sm:px-6 lg:px-8`;
}

// Custom hook for responsive values
export function useResponsiveValue<T>(values: Partial<Record<keyof typeof breakpoints, T>>): T | undefined {
  const { breakpoint } = useBreakpoint();
  
  // Return the value for current breakpoint or fallback to smaller breakpoints
  const breakpointOrder: (keyof typeof breakpoints)[] = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = breakpointOrder.indexOf(breakpoint as keyof typeof breakpoints);
  
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}

// Hook for media queries
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Predefined media query hooks
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`);
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
}

export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}