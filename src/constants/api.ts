export const API_CONFIG = {
  // Local server endpoints
  BASE_URL: 'http://localhost:3001/api',
  
  // Request configuration
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Cache configuration
  CACHE_DURATION: 2 * 60 * 1000, // 2 minutes
  
  // Rate limiting
  RATE_LIMIT_REQUESTS: 30,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  
  // RSC parameters (not needed for local server)
  RSC_PARAM: '_rsc',
  RSC_VALUES: ['rxx9e', 'abc123', 'def456'],
};

// Token IDs (these are the actual token identifiers used in URLs)
export const TOKEN_IDS = {
  DUPE: 'fRfKGCriduzDwSudCwpL7ySCEiboNuryhZDVJtr1a1C',
  LAUNCHCOIN: 'Ey59PH7Z4BFU4HjyKnyMdWt5GGN76KazTAwQihoUXRnk',
  KLED: '1zJX5gRnjLgmTpq5sVwkq69mNDQkCemqoasyjaPW6jm',
  KNET: 'CfVs3waH2Z9TM397qSkaipTDhA9wWgtt8UchZKfwkYiu',
  STARTUP: '97PVGU2DzFqsAWaYU17ZBqGvQFmkqtdMywYBNPAfy8vy',
  PCULE: 'J27UYHX5oeaG1YbUGQc8BmJySXDjNWChdGB2Pi2TMDAq',
  YAPPER: 'H1aoUqmp2vJu5o8w3o8LjrN6jKyWErS69PtYxGhfoXxf',
  FITCOIN: 'Cr2mM4szbt8286XMn7iTpY5A8S17LbGAu1UyodkyEwn4',
  BUDDY: '65svCEvM4HdBHXKDxfhjm3yw1A6mKXkdS6HXWXDQTSNA',
  GIGGLES: 'Bsow2wFkVzy1itJnhLke6VRTqoEkYQZp7kbwPtS87FyN',
  GOONC: 'ENfpbQUM5xAnNP8ecyEQGFJ6KwbuPjMwv7ZjR29cDuAb',
  SUBY: 'G2pMCBjRQHHCkE79r9KAESvdhUCieWPZvX5GRFa3jCLg',
  YOURSELF: 'Etd4QU7PGuzh4ozkzzBBjMmySNkU21BZamB7qPR1xBLV',
  DTR: 'FkqvTmDNgxgcdS7fPbZoQhPVuaYJPwSsP8mm4p7oNgf6',
  RIP_VC: 'EeguLg7Zh6F86ZSJtcsDgsxUsA3t5Gci5Kr85AvkxA4B',
  RUNNIT: '5mjbjHRb327yvcWUc5WPywhCbYi32pqUqxPUCtpipBLV',
  ZEUZ: 'GvRf47WPg9uaYcyXEs5UxHL2D39P7yTByBDrQcyMk5wg',
  FINNA: '8bmDcRBjBfcoAtU9xFg8gSdUzvjK85cBmdgbMN9kuBLV',
  PROMPT: '9NW7fiBu4uHpLx3rxiMccucyKwADwuptTpb8z2YYj9SH',
  PNP: 'ArQNTJtmxuWQ77KB7a1PmoZc5Zd25jXmXPDWBX8qVoux',
};

export const API_ENDPOINTS = {
  // Server endpoints
  DASHBOARD_METRICS: '/dashboard',
  TOKEN_DETAIL: '/token/:tokenId',
  TOKENS_LIST: '/tokens',
  SEARCH: '/search',
  HEALTH: '/health',
};

// Real request headers to mimic browser behavior
export const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://www.believescreener.com/',
  'Origin': 'https://www.believescreener.com',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Believe Screener might be slow.',
  SERVER_ERROR: 'Believe Screener server error. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  PARSING_ERROR: 'Failed to parse response from Believe Screener.',
  NOT_FOUND: 'Requested data not found on Believe Screener.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};

// WebSocket Message Types (if we can establish WS connection)
export const WS_MESSAGE_TYPES = {
  SUBSCRIBE: 'subscribe',
  UNSUBSCRIBE: 'unsubscribe',
  PRICE_UPDATE: 'price_update',
  VOLUME_UPDATE: 'volume_update',
  MARKET_CAP_UPDATE: 'market_cap_update',
  NEW_TOKEN: 'new_token',
  TRADING_ACTIVITY: 'trading_activity',
};

// Cache keys
export const CACHE_KEYS = {
  DASHBOARD_METRICS: 'dashboard_metrics',
  TOKENS_LIST: 'tokens_list',
  TOKEN_DETAILS: 'token_details_',
  TRENDING_TOKENS: 'trending_tokens',
  SEARCH_RESULTS: 'search_results_',
};

// RSC (React Server Component) utilities
export const RSC_UTILS = {
  getRandomRscParam: () => {
    const values = API_CONFIG.RSC_VALUES;
    return values[Math.floor(Math.random() * values.length)];
  },
  
  buildTokenUrl: (tokenAddress: string) => {
    const rscParam = RSC_UTILS.getRandomRscParam();
    return `/token/${tokenAddress}?${API_CONFIG.RSC_PARAM}=${rscParam}`;
  },
};

// Common token addresses from Believe Screener (for testing)
export const KNOWN_TOKENS = {
  BELIEVE_SCREENER: '4PYijC1Xas63cxdoYnUg7SQgcg23UgNNcPmvbj6KNUSz',
};

export const RSC_PARAMS = [
  'rxx9e',
  'abc123',
  'def456',
  'ghi789',
  'jkl012',
];

export const KNOWN_TOKEN_ADDRESSES = Object.values(TOKEN_IDS);

export const ENDPOINTS = {
  TOKENS: '/api/tokens',
  TOKEN_DETAIL: '/token',
  DASHBOARD: '/api/dashboard',
  SEARCH: '/api/search',
}; 