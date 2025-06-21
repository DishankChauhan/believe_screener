// Colors - Based on Believe Screener branding
export const COLORS = {
  // Primary colors
  primary: '#00FF88', // Bright green from website
  primaryDark: '#00CC6A',
  
  // Background colors
  background: '#0A0A0A', // Very dark background
  backgroundSecondary: '#1A1A1A', // Secondary dark
  backgroundTertiary: '#2D2D2D', // Card backgrounds
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  
  // Status colors
  success: '#00FF88',
  error: '#FF4757',
  warning: '#FFA726',
  info: '#42A5F5',
  
  // Chart colors
  chartPrimary: '#00FF88',
  chartSecondary: '#FF4757',
  chartVolume: '#9C27B0',
  
  // Border colors
  border: '#333333',
  borderLight: '#444444',
  
  // Special colors
  accent: '#6C5CE7',
  highlight: '#FDCB6E',
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.believescreener.com', // Placeholder - needs to be discovered
  WEBSOCKET_URL: 'wss://ws.believescreener.com', // Placeholder
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_METRICS: '/api/v1/dashboard/metrics',
  
  // Tokens
  TOKENS_LIST: '/api/v1/tokens',
  TOKEN_DETAIL: '/api/v1/tokens/:id',
  TOKEN_PERFORMANCE: '/api/v1/tokens/:id/performance',
  TOKEN_HOLDERS: '/api/v1/tokens/:id/holders',
  
  // Portfolio
  PORTFOLIO: '/api/v1/portfolio/:address',
  PORTFOLIO_HISTORY: '/api/v1/portfolio/:address/history',
  
  // Search
  SEARCH_TOKENS: '/api/v1/search/tokens',
};

// Default values
export const DEFAULTS = {
  // Pagination
  PAGE_SIZE: 50,
  INITIAL_PAGE: 1,
  
  // Refresh intervals (in milliseconds)
  DATA_REFRESH_INTERVAL: 30000, // 30 seconds
  PRICE_UPDATE_INTERVAL: 5000, // 5 seconds
  
  // Chart configuration
  CHART_POINTS: 100,
  DEFAULT_TIMEFRAME: '24h',
  
  // Token filters
  MIN_MARKET_CAP: 1000,
  MAX_MARKET_CAP: 1000000000,
};

// Timeframes for charts and data
export const TIMEFRAMES = [
  { key: '30m', label: '30m', value: 30 },
  { key: '1h', label: '1H', value: 60 },
  { key: '2h', label: '2H', value: 120 },
  { key: '4h', label: '4H', value: 240 },
  { key: '6h', label: '6H', value: 360 },
  { key: '8h', label: '8H', value: 480 },
  { key: '12h', label: '12H', value: 720 },
  { key: '24h', label: '24H', value: 1440 },
];

// Sort options for token list
export const SORT_OPTIONS = [
  { key: 'marketCap', label: 'Market Cap', order: 'desc' },
  { key: 'volume24h', label: '24h Volume', order: 'desc' },
  { key: 'change24h', label: '24h Change', order: 'desc' },
  { key: 'price', label: 'Price', order: 'desc' },
  { key: 'age', label: 'Age', order: 'asc' },
  { key: 'holders', label: 'Holders', order: 'desc' },
];

// Filter categories
export const FILTER_CATEGORIES = {
  TOP_75: 'top75',
  NEW_LAUNCHES: 'new_launches',
  FAVORITES: 'favorites',
};

// Screen names
export const SCREEN_NAMES = {
  // Main tabs
  DASHBOARD: 'Dashboard',
  TOKENS: 'Tokens',
  PORTFOLIO: 'Portfolio',
  SEARCH: 'Search',
  
  // Stack screens
  TOKEN_DETAIL: 'TokenDetail',
  PORTFOLIO_DETAIL: 'PortfolioDetail',
};

// Storage keys
export const STORAGE_KEYS = {
  FAVORITES: '@believe_screener_favorites',
  PORTFOLIO_ADDRESSES: '@believe_screener_portfolio_addresses',
  SETTINGS: '@believe_screener_settings',
  LAST_REFRESH: '@believe_screener_last_refresh',
};

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Screen dimensions breakpoints
export const BREAKPOINTS = {
  SMALL: 320,
  MEDIUM: 768,
  LARGE: 1024,
};

// Format options
export const FORMAT_OPTIONS = {
  CURRENCY: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  },
  PERCENTAGE: {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
  LARGE_NUMBER: {
    notation: 'compact' as const,
    maximumFractionDigits: 2,
  },
}; 