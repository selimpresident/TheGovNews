import { renderHook, act } from '@testing-library/react-hooks';
import { useBreakpoint, isMobile, isTablet, isDesktop, breakpoints } from './responsive';

describe('Responsive utilities', () => {
  const originalInnerWidth = window.innerWidth;
  
  afterEach(() => {
    // Restore original window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    
    // Cleanup window resize event
    window.dispatchEvent(new Event('resize'));
  });
  
  test('useBreakpoint returns correct breakpoint for mobile', () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // iPhone size
    });
    
    const { result } = renderHook(() => useBreakpoint());
    
    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    
    expect(result.current.breakpoint).toBe('xs');
  });
  
  test('useBreakpoint returns correct breakpoint for tablet', () => {
    // Set window width to tablet size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800 // iPad size
    });
    
    const { result } = renderHook(() => useBreakpoint());
    
    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    
    expect(result.current.breakpoint).toBe('md');
  });
  
  test('isMobile returns true for mobile devices', () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // iPhone size
    });
    
    expect(isMobile()).toBe(true);
    expect(isTablet()).toBe(false);
    expect(isDesktop()).toBe(false);
  });
});