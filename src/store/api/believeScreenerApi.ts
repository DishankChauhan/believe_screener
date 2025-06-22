import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '../../constants/api';
import { apiService } from '../../services/api';
import { 
  Token, 
  DashboardMetrics, 
  ApiResponse, 
  TokenFilters, 
  ChartDataPoint, 
  TopHolder, 
  TradingActivity 
} from '../../types';

// Enhanced base query with error handling and auth
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  prepareHeaders: async (headers, { getState }) => {
    // Add auth token if available
    const token = await import('@react-native-async-storage/async-storage').then(
      module => module.default.getItem('api_token')
    );
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    headers.set('User-Agent', 'BelieveScreenerMobile/1.0.0');
    
    return headers;
  },
});

// Base query with retry logic
const baseQueryWithRetry = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Retry on network errors or 5xx server errors
  if (result.error && (result.error.status === 'FETCH_ERROR' || 
      (typeof result.error.status === 'number' && result.error.status >= 500))) {
    let retryCount = 0;
    
    while (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (retryCount + 1)));
      result = await baseQuery(args, api, extraOptions);
      
      if (!result.error) break;
      retryCount++;
    }
  }
  
  return result;
};

export const believeScreenerApi = createApi({
  reducerPath: 'believeScreenerApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['DashboardMetrics', 'Token', 'TokenDetails', 'Trending', 'Portfolio', 'Watchlist'],
  keepUnusedDataFor: API_CONFIG.CACHE_DURATION / 1000, // Convert to seconds
  endpoints: (builder) => ({
    
    // Dashboard Metrics - use API service
    getDashboardMetrics: builder.query<DashboardMetrics, void>({
      queryFn: async () => {
        try {
          const data = await apiService.getDashboardMetrics();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['DashboardMetrics'],
    }),

    // Token List - use API service
    getTokens: builder.query<{tokens: Token[], pagination: any}, TokenFilters & { page?: number; limit?: number }>({
      queryFn: async (params) => {
        try {
          const tokens = await apiService.getTokens(params);
          return { data: { tokens, pagination: {} } };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.tokens.map(({ id }) => ({ type: 'Token' as const, id })),
              { type: 'Token', id: 'LIST' },
            ]
          : [{ type: 'Token', id: 'LIST' }],
    }),

    // Token Details - use API service
    getTokenDetails: builder.query<Token, string>({
      queryFn: async (tokenId) => {
        try {
          const data = await apiService.getTokenDetails(tokenId);
          if (!data) {
            return { error: { status: 'CUSTOM_ERROR', error: 'Token not found' } };
          }
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, tokenId) => [{ type: 'TokenDetails', id: tokenId }],
    }),

    // Token Price History (not available in real API - return empty array)
    getTokenPriceHistory: builder.query<ChartDataPoint[], { address: string; timeframe?: string }>({
      queryFn: async () => ({ data: [] }),
      providesTags: (result, error, { address }) => [{ type: 'TokenDetails', id: `${address}-history` }],
    }),

    // Token Holders (not available in real API - return empty array)
    getTokenHolders: builder.query<TopHolder[], string>({
      queryFn: async () => ({ data: [] }),
      providesTags: (result, error, address) => [{ type: 'TokenDetails', id: `${address}-holders` }],
    }),

    // Trading Activity (not available in real API - return empty object)
    getTokenTrades: builder.query<TradingActivity, string>({
      queryFn: async () => ({
        data: {
          totalTrades: 0,
          uniqueWallets: 0,
          buyVolume: 0,
          sellVolume: 0,
          buyTrades: 0,
          sellTrades: 0,
        }
      }),
      providesTags: (result, error, address) => [{ type: 'TokenDetails', id: `${address}-trades` }],
    }),

    // Search Tokens - use API service
    searchTokens: builder.query<Token[], string>({
      queryFn: async (searchQuery) => {
        try {
          const data = await apiService.searchTokens(searchQuery);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      keepUnusedDataFor: 60,
    }),

    // Trending Tokens - use API service (same as getTokens for now)
    getTrendingTokens: builder.query<Token[], void>({
      queryFn: async () => {
        try {
          const data = await apiService.getTokens();
          return { data: data.slice(0, 10) }; // Return top 10 as trending
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Trending'],
    }),

    // New Token Launches - use API service (same as getTokens for now)
    getNewLaunches: builder.query<Token[], void>({
      queryFn: async () => {
        try {
          const data = await apiService.getTokens();
          return { data: data.slice(0, 5) }; // Return top 5 as new launches
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Token'],
    }),

    // Portfolio/Watchlist Management (mock responses)
    addToWatchlist: builder.mutation<void, string>({
      queryFn: async () => ({ data: undefined }),
      invalidatesTags: ['Watchlist'],
    }),

    removeFromWatchlist: builder.mutation<void, string>({
      queryFn: async () => ({ data: undefined }),
      invalidatesTags: ['Watchlist'],
    }),

    // Health Check - use API service
    healthCheck: builder.query<{ status: string; timestamp: number }, void>({
      queryFn: async () => {
        try {
          const isHealthy = await apiService.healthCheck();
          return {
            data: {
              status: isHealthy ? 'ok' : 'error',
              timestamp: Date.now(),
            }
          };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDashboardMetricsQuery,
  useGetTokensQuery,
  useGetTokenDetailsQuery,
  useGetTokenPriceHistoryQuery,
  useGetTokenHoldersQuery,
  useGetTokenTradesQuery,
  useSearchTokensQuery,
  useLazySearchTokensQuery,
  useGetTrendingTokensQuery,
  useGetNewLaunchesQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
  useHealthCheckQuery,
} = believeScreenerApi;

// Utility selectors for getting specific data
export const selectTokenById = (tokenId: string) => 
  believeScreenerApi.endpoints.getTokenDetails.select(tokenId);

export const selectTokensWithFilters = (filters: TokenFilters) =>
  believeScreenerApi.endpoints.getTokens.select(filters); 