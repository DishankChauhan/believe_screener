import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '../../constants';
import type {
  Token,
  TokenListResponse,
  TokenPerformance,
  DashboardMetrics,
  Portfolio,
  TopHolder,
  TradingActivity,
  ApiResponse,
  TokenFilters,
} from '../../types';

// Base query with authentication and error handling
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  prepareHeaders: (headers, { getState }) => {
    // Add any auth headers here if needed
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Token', 'Dashboard', 'Portfolio', 'Performance'],
  endpoints: (builder) => ({
    // Dashboard endpoints
    getDashboardMetrics: builder.query<DashboardMetrics, void>({
      query: () => API_ENDPOINTS.DASHBOARD_METRICS,
      providesTags: ['Dashboard'],
    }),

    // Token endpoints
    getTokens: builder.query<TokenListResponse, { 
      page?: number; 
      limit?: number; 
      filters?: TokenFilters 
    }>({
      query: ({ page = 1, limit = 50, filters = {} }) => ({
        url: API_ENDPOINTS.TOKENS_LIST,
        params: {
          page,
          limit,
          ...filters,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.tokens.map(({ id }) => ({ type: 'Token' as const, id })),
              { type: 'Token', id: 'LIST' },
            ]
          : [{ type: 'Token', id: 'LIST' }],
      // Transform response to match our interface
      transformResponse: (response: any): TokenListResponse => ({
        tokens: response.data || [],
        totalCount: response.totalCount || 0,
        hasMore: response.hasMore || false,
      }),
    }),

    getTokenDetail: builder.query<Token, string>({
      query: (id) => API_ENDPOINTS.TOKEN_DETAIL.replace(':id', id),
      providesTags: (result, error, id) => [{ type: 'Token', id }],
    }),

    getTokenPerformance: builder.query<TokenPerformance, { 
      id: string; 
      timeframe?: string 
    }>({
      query: ({ id, timeframe = '24h' }) => ({
        url: API_ENDPOINTS.TOKEN_PERFORMANCE.replace(':id', id),
        params: { timeframe },
      }),
      providesTags: (result, error, { id }) => [{ type: 'Performance', id }],
    }),

    getTokenHolders: builder.query<TopHolder[], { 
      id: string; 
      limit?: number 
    }>({
      query: ({ id, limit = 20 }) => ({
        url: API_ENDPOINTS.TOKEN_HOLDERS.replace(':id', id),
        params: { limit },
      }),
      transformResponse: (response: any): TopHolder[] => response.data || [],
    }),

    // Portfolio endpoints
    getPortfolio: builder.query<Portfolio, string>({
      query: (address) => API_ENDPOINTS.PORTFOLIO.replace(':address', address),
      providesTags: (result, error, address) => [{ type: 'Portfolio', id: address }],
    }),

    // Search endpoint
    searchTokens: builder.query<Token[], string>({
      query: (searchQuery) => ({
        url: API_ENDPOINTS.SEARCH_TOKENS,
        params: { q: searchQuery },
      }),
      transformResponse: (response: any): Token[] => response.data || [],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDashboardMetricsQuery,
  useGetTokensQuery,
  useGetTokenDetailQuery,
  useGetTokenPerformanceQuery,
  useGetTokenHoldersQuery,
  useGetPortfolioQuery,
  useSearchTokensQuery,
  useLazySearchTokensQuery,
} = apiSlice; 