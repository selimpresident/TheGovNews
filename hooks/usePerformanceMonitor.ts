/**
 * Performance Monitoring Hook
 * Provides utilities for monitoring component performance and render times
 */

import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  propsChanged: string[];
  timestamp: Date;
  renderCount: number;
}

/**
 * Performance monitor configuration
 */
export interface PerformanceConfig {
  enabled?: boolean;
  logToConsole?: boolean;
  threshold?: number; // Log only if render time exceeds threshold (ms)
  trackProps?: boolean;
}

/**
 * Default configuration
 */
const defaultConfig: PerformanceConfig = {
  enabled: import.meta.env?.DEV ?? false,
  logToConsole: import.meta.env?.DEV ?? false,
  threshold: 16, // 16ms = 60fps threshold
  trackProps: true
};

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(
  componentName: string,
  props?: Record<string, unknown>,
  config: PerformanceConfig = {}
) {
  const finalConfig = { ...defaultConfig, ...config };
  const renderStartTime = useRef<number>(0);
  const previousProps = useRef<Record<string, unknown>>(props || {});
  const renderCount = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics[]>([]);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    if (!finalConfig.enabled) return;
    renderStartTime.current = performance.now();
  }, [finalConfig.enabled]);

  // End performance measurement and log results
  const endMeasurement = useCallback(() => {
    if (!finalConfig.enabled || renderStartTime.current === 0) return;

    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;

    // Track prop changes if enabled
    let propsChanged: string[] = [];
    if (finalConfig.trackProps && props) {
      propsChanged = Object.keys(props).filter(key => {
        const currentValue = props[key];
        const previousValue = previousProps.current[key];
        return currentValue !== previousValue;
      });
      previousProps.current = { ...props };
    }

    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      propsChanged,
      timestamp: new Date(),
      renderCount: renderCount.current
    };

    metrics.current.push(metric);

    // Log to console if enabled and threshold exceeded
    if (finalConfig.logToConsole && renderTime > (finalConfig.threshold || 0)) {
      console.warn(`🐌 Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        propsChanged: propsChanged.length > 0 ? propsChanged : 'No props tracked',
        threshold: `${finalConfig.threshold}ms`
      });
    }

    renderStartTime.current = 0;
  }, [componentName, props, finalConfig]);

  // Start measurement on every render
  startMeasurement();

  // End measurement after render completes
  useEffect(() => {
    endMeasurement();
  });

  // Get performance statistics
  const getStats = useCallback(() => {
    if (metrics.current.length === 0) {
      return {
        totalRenders: 0,
        averageRenderTime: 0,
        maxRenderTime: 0,
        minRenderTime: 0,
        slowRenders: 0
      };
    }

    const renderTimes = metrics.current.map(m => m.renderTime);
    const slowRenders = renderTimes.filter(time => time > (finalConfig.threshold || 16)).length;

    return {
      totalRenders: metrics.current.length,
      averageRenderTime: renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length,
      maxRenderTime: Math.max(...renderTimes),
      minRenderTime: Math.min(...renderTimes),
      slowRenders,
      slowRenderPercentage: (slowRenders / metrics.current.length) * 100
    };
  }, [finalConfig.threshold]);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    metrics.current = [];
    renderCount.current = 0;
  }, []);

  // Get recent metrics
  const getRecentMetrics = useCallback((count: number = 10) => {
    return metrics.current.slice(-count);
  }, []);

  return {
    getStats,
    clearMetrics,
    getRecentMetrics,
    renderCount: renderCount.current
  };
}

/**
 * Higher-order component for performance monitoring
 */
export function withPerformanceMonitor<P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string,
  config?: PerformanceConfig
) {
  const WrappedComponent = (props: P) => {
    const name = componentName || Component.displayName || Component.name || 'Unknown';
    usePerformanceMonitor(name, props as Record<string, unknown>, config);
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceMonitor(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Performance profiler hook for measuring specific operations
 */
export function useProfiler() {
  const measurements = useRef<Map<string, number>>(new Map());

  const start = useCallback((label: string) => {
    measurements.current.set(label, performance.now());
  }, []);

  const end = useCallback((label: string, logResult: boolean = true) => {
    const startTime = measurements.current.get(label);
    if (!startTime) {
      console.warn(`No start time found for profiler label: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    measurements.current.delete(label);

    if (logResult && import.meta.env.DEV) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }, []);

  const measure = useCallback(async <T>(
    label: string,
    operation: () => Promise<T> | T,
    logResult: boolean = true
  ): Promise<T> => {
    start(label);
    try {
      const result = await operation();
      end(label, logResult);
      return result;
    } catch (error) {
      end(label, logResult);
      throw error;
    }
  }, [start, end]);

  return { start, end, measure };
}

/**
 * Hook for monitoring API call performance
 */
export function useApiPerformanceMonitor() {
  const apiMetrics = useRef<Map<string, { count: number; totalTime: number; errors: number }>>(new Map());

  const recordApiCall = useCallback((
    endpoint: string,
    duration: number,
    success: boolean
  ) => {
    const current = apiMetrics.current.get(endpoint) || { count: 0, totalTime: 0, errors: 0 };
    
    apiMetrics.current.set(endpoint, {
      count: current.count + 1,
      totalTime: current.totalTime + duration,
      errors: current.errors + (success ? 0 : 1)
    });
  }, []);

  const getApiStats = useCallback((endpoint?: string) => {
    if (endpoint) {
      const stats = apiMetrics.current.get(endpoint);
      if (!stats) return null;
      
      return {
        endpoint,
        averageTime: stats.totalTime / stats.count,
        totalCalls: stats.count,
        errorRate: (stats.errors / stats.count) * 100,
        totalTime: stats.totalTime
      };
    }

    // Return stats for all endpoints
    const allStats = Array.from(apiMetrics.current.entries()).map(([endpoint, stats]) => ({
      endpoint,
      averageTime: stats.totalTime / stats.count,
      totalCalls: stats.count,
      errorRate: (stats.errors / stats.count) * 100,
      totalTime: stats.totalTime
    }));

    return allStats.sort((a, b) => b.averageTime - a.averageTime);
  }, []);

  const clearApiStats = useCallback(() => {
    apiMetrics.current.clear();
  }, []);

  return {
    recordApiCall,
    getApiStats,
    clearApiStats
  };
}

/**
 * Development-only performance debugging utilities
 */
export const PerformanceDebugger = {
  /**
   * Log component render information
   */
  logRender: (componentName: string, props?: Record<string, unknown>) => {
    if (!import.meta.env.DEV) return;
    
    console.group(`🔄 ${componentName} rendered`);
    console.log('Timestamp:', new Date().toISOString());
    if (props) {
      console.log('Props:', props);
    }
    console.trace('Render stack');
    console.groupEnd();
  },

  /**
   * Measure and log function execution time
   */
  measureFunction: <T extends (...args: any[]) => any>(
    fn: T,
    name?: string
  ): T => {
    if (!import.meta.env.DEV) return fn;

    return ((...args: Parameters<T>) => {
      const functionName = name || fn.name || 'Anonymous function';
      const start = performance.now();
      const result = fn(...args);
      const end = performance.now();
      
      console.log(`⚡ ${functionName}: ${(end - start).toFixed(2)}ms`);
      return result;
    }) as T;
  },

  /**
   * Create a performance mark for Chrome DevTools
   */
  mark: (name: string) => {
    if (!import.meta.env.DEV || typeof performance.mark !== 'function') return;
    performance.mark(name);
  },

  /**
   * Measure time between two marks
   */
  measureBetweenMarks: (name: string, startMark: string, endMark: string) => {
    if (!import.meta.env.DEV || typeof performance.measure !== 'function') return;
    
    try {
      performance.measure(name, startMark, endMark);
    } catch (error) {
      console.warn('Failed to measure between marks:', error);
    }
  }
};