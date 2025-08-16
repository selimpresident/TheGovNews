import { useEffect, useState } from 'react';

// Breakpoints aligned with common device sizes
export const breakpoints = {
  xs: 320,  // Small phones
  sm: 640,  // Large phones
  md: 768,  // Tablets
  lg: 1024, // Laptops
  xl: 1280, // Desktops
  '2xl': 1536 // Large screens
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
      } else {
        setBreakpoint('2xl');
      }
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
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