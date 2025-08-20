/**
 * Unified Data Source State Management
 * Replaces multiple useState hooks with a single useReducer for better state management
 */

import React, { useReducer, useCallback } from 'react';
import { 
  UcdpEvent, 
  GdeltArticle, 
  ExternalArticle, 
  FactbookData, 
  WorldBankIndicator,
  OecdIndicator,
  NoaaIndicator,
  ReliefWebUpdate,
  PopulationPyramidData,
  OsmData,
  SocialPost,
  SocialMediaLinks
} from '../types';

/**
 * Data source state interface
 */
export interface DataSourceState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

/**
 * Social media specific state
 */
export interface SocialMediaState {
  status: 'idle' | 'loading' | 'success' | 'error';
  posts: SocialPost[];
  links: SocialMediaLinks | null;
}

/**
 * Dashboard data state
 */
export interface DashboardData {
  population: number | null;
  gdp: number | null;
  latestEventDate: string | null;
}

/**
 * Complete application data state
 */
export interface AppDataState {
  conflicts: DataSourceState<UcdpEvent[]>;
  gdelt: DataSourceState<GdeltArticle[]>;
  nationalPress: DataSourceState<ExternalArticle[]>;
  factbook: DataSourceState<FactbookData>;
  worldBank: DataSourceState<WorldBankIndicator[]>;
  oecd: DataSourceState<OecdIndicator[]>;
  noaa: DataSourceState<NoaaIndicator[]>;
  reliefWeb: DataSourceState<ReliefWebUpdate[]>;
  populationPyramid: DataSourceState<PopulationPyramidData>;
  osm: DataSourceState<OsmData>;
  socialMedia: SocialMediaState;
  dashboard: DashboardData;
  worldAtlas: DataSourceState<any>;
}

/**
 * Data source keys for type safety
 */
export type DataSourceKey = keyof Omit<AppDataState, 'socialMedia' | 'dashboard' | 'worldAtlas'>;
export type AllDataSourceKey = keyof AppDataState;

/**
 * Action types for the reducer
 */
export type DataAction = 
  | { type: 'FETCH_START'; source: DataSourceKey }
  | { type: 'FETCH_SUCCESS'; source: DataSourceKey; data: any }
  | { type: 'FETCH_ERROR'; source: DataSourceKey; error: string }
  | { type: 'SOCIAL_MEDIA_START'; links: SocialMediaLinks | null }
  | { type: 'SOCIAL_MEDIA_SUCCESS'; posts: SocialPost[]; links: SocialMediaLinks | null }
  | { type: 'SOCIAL_MEDIA_ERROR'; links: SocialMediaLinks | null }
  | { type: 'UPDATE_DASHBOARD'; data: Partial<DashboardData> }
  | { type: 'WORLD_ATLAS_SUCCESS'; data: any }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_SOURCE'; source: AllDataSourceKey };

/**
 * Initial state factory
 */
const createInitialDataSourceState = <T = unknown>(): DataSourceState<T> => ({
  data: null,
  loading: false,
  error: null,
  lastFetched: null
});

/**
 * Initial application state
 */
const initialState: AppDataState = {
  conflicts: createInitialDataSourceState<UcdpEvent[]>(),
  gdelt: createInitialDataSourceState<GdeltArticle[]>(),
  nationalPress: createInitialDataSourceState<ExternalArticle[]>(),
  factbook: createInitialDataSourceState<FactbookData>(),
  worldBank: createInitialDataSourceState<WorldBankIndicator[]>(),
  oecd: createInitialDataSourceState<OecdIndicator[]>(),
  noaa: createInitialDataSourceState<NoaaIndicator[]>(),
  reliefWeb: createInitialDataSourceState<ReliefWebUpdate[]>(),
  populationPyramid: createInitialDataSourceState<PopulationPyramidData>(),
  osm: createInitialDataSourceState<OsmData>(),
  socialMedia: {
    status: 'idle',
    posts: [],
    links: null
  },
  dashboard: {
    population: null,
    gdp: null,
    latestEventDate: null
  },
  worldAtlas: createInitialDataSourceState<any>()
};

/**
 * Data reducer function
 */
function dataReducer(state: AppDataState, action: DataAction): AppDataState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        [action.source]: {
          ...state[action.source],
          loading: true,
          error: null
        }
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        [action.source]: {
          data: action.data,
          loading: false,
          error: null,
          lastFetched: new Date()
        }
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        [action.source]: {
          ...state[action.source],
          loading: false,
          error: action.error,
          data: null
        }
      };

    case 'SOCIAL_MEDIA_START':
      return {
        ...state,
        socialMedia: {
          status: 'loading',
          posts: [],
          links: action.links
        }
      };

    case 'SOCIAL_MEDIA_SUCCESS':
      return {
        ...state,
        socialMedia: {
          status: 'success',
          posts: action.posts,
          links: action.links
        }
      };

    case 'SOCIAL_MEDIA_ERROR':
      return {
        ...state,
        socialMedia: {
          status: 'error',
          posts: [],
          links: action.links
        }
      };

    case 'UPDATE_DASHBOARD':
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          ...action.data
        }
      };

    case 'WORLD_ATLAS_SUCCESS':
      return {
        ...state,
        worldAtlas: {
          data: action.data,
          loading: false,
          error: null,
          lastFetched: new Date()
        }
      };

    case 'RESET_ALL':
      return initialState;

    case 'RESET_SOURCE':
      if (action.source === 'socialMedia') {
        return {
          ...state,
          socialMedia: {
            status: 'idle',
            posts: [],
            links: null
          }
        };
      }
      if (action.source === 'dashboard') {
        return {
          ...state,
          dashboard: {
            population: null,
            gdp: null,
            latestEventDate: null
          }
        };
      }
      return {
        ...state,
        [action.source]: createInitialDataSourceState()
      };

    default:
      return state;
  }
}

/**
 * Custom hook for data source management
 */
export function useDataSourceReducer() {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Action creators for better type safety and convenience
  const actions = {
    fetchStart: useCallback((source: DataSourceKey) => {
      dispatch({ type: 'FETCH_START', source });
    }, []),

    fetchSuccess: useCallback((source: DataSourceKey, data: any) => {
      dispatch({ type: 'FETCH_SUCCESS', source, data });
    }, []),

    fetchError: useCallback((source: DataSourceKey, error: string) => {
      dispatch({ type: 'FETCH_ERROR', source, error });
    }, []),

    socialMediaStart: useCallback((links: SocialMediaLinks | null) => {
      dispatch({ type: 'SOCIAL_MEDIA_START', links });
    }, []),

    socialMediaSuccess: useCallback((posts: SocialPost[], links: SocialMediaLinks | null) => {
      dispatch({ type: 'SOCIAL_MEDIA_SUCCESS', posts, links });
    }, []),

    socialMediaError: useCallback((links: SocialMediaLinks | null) => {
      dispatch({ type: 'SOCIAL_MEDIA_ERROR', links });
    }, []),

    updateDashboard: useCallback((data: Partial<DashboardData>) => {
      dispatch({ type: 'UPDATE_DASHBOARD', data });
    }, []),

    worldAtlasSuccess: useCallback((data: any) => {
      dispatch({ type: 'WORLD_ATLAS_SUCCESS', data });
    }, []),

    resetAll: useCallback(() => {
      dispatch({ type: 'RESET_ALL' });
    }, []),

    resetSource: useCallback((source: AllDataSourceKey) => {
      dispatch({ type: 'RESET_SOURCE', source });
    }, [])
  };

  // Convenience getters - memoized for performance
  const getters = React.useMemo(() => ({
    isLoading: (source: DataSourceKey) => state[source].loading,
    hasError: (source: DataSourceKey) => !!state[source].error,
    getData: <T>(source: DataSourceKey) => state[source].data as T | null,
    getError: (source: DataSourceKey) => state[source].error,
    isDataStale: (source: DataSourceKey, maxAgeMs: number = 5 * 60 * 1000) => {
      const lastFetched = state[source].lastFetched;
      if (!lastFetched) return true;
      return Date.now() - lastFetched.getTime() > maxAgeMs;
    },
    hasData: (source: DataSourceKey) => state[source].data !== null
  }), [state]);

  return {
    state,
    actions,
    getters
  };
}

/**
 * Type-safe data fetcher helper
 */
export interface DataFetcher<T> {
  fetch: () => Promise<T>;
  source: DataSourceKey;
}

/**
 * Generic data fetching hook that integrates with the reducer
 */
export function useDataFetcher<T>(
  fetcher: DataFetcher<T>,
  dependencies: React.DependencyList = []
) {
  const { actions, getters } = useDataSourceReducer();

  const fetchData = useCallback(async () => {
    try {
      actions.fetchStart(fetcher.source);
      const data = await fetcher.fetch();
      actions.fetchSuccess(fetcher.source, data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      actions.fetchError(fetcher.source, errorMessage);
      throw error;
    }
  }, [actions, fetcher, ...dependencies]);

  return {
    fetchData,
    isLoading: getters.isLoading(fetcher.source),
    hasError: getters.hasError(fetcher.source),
    data: getters.getData<T>(fetcher.source),
    error: getters.getError(fetcher.source),
    isStale: getters.isDataStale(fetcher.source),
    hasData: getters.hasData(fetcher.source)
  };
}