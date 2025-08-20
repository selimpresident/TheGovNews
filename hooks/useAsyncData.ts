/**
 * Custom Hook for Async Data Fetching
 * Provides standardized async data fetching with loading, error, and caching
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseAsyncDataOptions<T> {
  immediate?: boolean;
  dependencies?: React.DependencyList;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  cacheTTL?: number; // Time to live in milliseconds
  retries?: number;
  retryDelay?: number;
}

export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
) {
  const {
    immediate = true,
    dependencies = [],
    onSuccess,
    onError,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes default
    retries = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<AsyncDataState<T>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check cache for existing data
  const getCachedData = useCallback((): T | null => {
    if (!cacheKey) return null;
    
    const cached = cache.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      cache.delete(cacheKey);
      return null;
    }
    
    return cached.data;
  }, [cacheKey]);

  // Set data in cache
  const setCachedData = useCallback((data: T) => {
    if (!cacheKey) return;
    
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL
    });
  }, [cacheKey, cacheTTL]);

  // Execute fetch with retry logic
  const executeFetch = useCallback(async (attemptCount = 0): Promise<void> => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const data = await fetchFn();

      // Check if request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setState({
        data,
        loading: false,
        error: null,
        lastFetched: new Date()
      });

      // Cache the data
      setCachedData(data);

      // Call success callback
      if (onSuccess) {
        onSuccess(data);
      }

    } catch (error) {
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Retry logic
      if (attemptCount < retries) {
        retryTimeoutRef.current = setTimeout(() => {
          executeFetch(attemptCount + 1);
        }, retryDelay * Math.pow(2, attemptCount)); // Exponential backoff
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));

      // Call error callback
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [fetchFn, onSuccess, onError, setCachedData, retries, retryDelay]);

  // Public execute function
  const execute = useCallback(() => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setState({
        data: cachedData,
        loading: false,
        error: null,
        lastFetched: new Date()
      });
      return Promise.resolve();
    }

    return executeFetch();
  }, [getCachedData, executeFetch]);

  // Refresh function (ignores cache)
  const refresh = useCallback(() => {
    if (cacheKey) {
      cache.delete(cacheKey);
    }
    return executeFetch();
  }, [cacheKey, executeFetch]);

  // Clear function
  const clear = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Clear cache
    if (cacheKey) {
      cache.delete(cacheKey);
    }

    // Reset state
    setState({
      data: null,
      loading: false,
      error: null,
      lastFetched: null
    });
  }, [cacheKey]);

  // Effect for immediate execution and dependency changes
  useEffect(() => {
    if (immediate) {
      execute();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [immediate, execute, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    execute,
    refresh,
    clear,
    isStale: cacheKey ? !getCachedData() : false
  };
}

/**
 * Hook for managing multiple async data sources
 */
export function useMultipleAsyncData<T extends Record<string, any>>(
  sources: { [K in keyof T]: () => Promise<T[K]> },
  options: Omit<UseAsyncDataOptions<any>, 'onSuccess' | 'onError'> & {
    onSuccess?: (data: T) => void;
    onError?: (errors: Partial<Record<keyof T, Error>>) => void;
  } = {}
) {
  const [state, setState] = useState<{
    data: Partial<T>;
    loading: Record<keyof T, boolean>;
    errors: Partial<Record<keyof T, string>>;
    allLoaded: boolean;
  }>({
    data: {},
    loading: {} as Record<keyof T, boolean>,
    errors: {},
    allLoaded: false
  });

  const sourceKeys = Object.keys(sources) as (keyof T)[];

  // Initialize loading state
  useEffect(() => {
    const initialLoading = {} as Record<keyof T, boolean>;
    sourceKeys.forEach(key => {
      initialLoading[key] = false;
    });
    setState(prev => ({ ...prev, loading: initialLoading }));
  }, []);

  // Create individual async data hooks
  const asyncHooks = sourceKeys.reduce((acc, key) => {
    acc[key] = useAsyncData(sources[key], {
      ...options,
      immediate: false,
      onSuccess: (data) => {
        setState(prev => ({
          ...prev,
          data: { ...prev.data, [key]: data },
          loading: { ...prev.loading, [key]: false },
          errors: { ...prev.errors, [key]: undefined }
        }));
      },
      onError: (error) => {
        setState(prev => ({
          ...prev,
          loading: { ...prev.loading, [key]: false },
          errors: { ...prev.errors, [key]: error.message }
        }));
      }
    });
    return acc;
  }, {} as Record<keyof T, ReturnType<typeof useAsyncData>>);

  // Execute all sources
  const executeAll = useCallback(async () => {
    // Set all to loading
    const loadingState = {} as Record<keyof T, boolean>;
    sourceKeys.forEach(key => {
      loadingState[key] = true;
    });
    setState(prev => ({ ...prev, loading: loadingState, errors: {} }));

    // Execute all
    await Promise.allSettled(
      sourceKeys.map(key => asyncHooks[key].execute())
    );

    // Check if all loaded
    setState(prev => ({
      ...prev,
      allLoaded: sourceKeys.every(key => prev.data[key] !== undefined || prev.errors[key] !== undefined)
    }));
  }, [sourceKeys, asyncHooks]);

  // Refresh all sources
  const refreshAll = useCallback(async () => {
    await Promise.allSettled(
      sourceKeys.map(key => asyncHooks[key].refresh())
    );
  }, [sourceKeys, asyncHooks]);

  return {
    ...state,
    executeAll,
    refreshAll,
    individual: asyncHooks
  };
}

/**
 * Utility function to clear all cached data
 */
export function clearAllCache() {
  cache.clear();
}

/**
 * Utility function to get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
    totalMemory: JSON.stringify(Array.from(cache.values())).length
  };
}