// Token related types
export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  change30m: number;
  liquidity: number;
  trades24h: number;
  transactions24h: number;
  holders: number;
  age: string;
  contractAddress: string;
  address: string;
  createdAt: number;
}

// Portfolio related types
export interface Portfolio {
  totalValue: number;
  averagePosition: number;
  largestHolding: number;
  concentration: number;
  tokensHeld: number;
  holdings: Holding[];
}

export interface Holding {
  token: Token;
  position: number;
  value: number;
  weight: number;
}

// Dashboard metrics types
export interface DashboardMetrics {
  lifetimeVolume: number;
  coinLaunches: number;
  activeCoins: number;
  totalMarketCap: number;
  volume24h: number;
  transactions24h: number;
  totalLiquidity: number;
  creatorCoinsStats: {
    marketCap: number;
    volume: number;
    transactions: number;
    liquidity: number;
  };
  launchCoinStats: {
    marketCap: number;
    volume: number;
    transactions: number;
    liquidity: number;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TokenListResponse {
  tokens: Token[];
  totalCount: number;
  hasMore: boolean;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface TokenPerformance {
  currentPrice: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  chartData: ChartDataPoint[];
  momentum: {
    [key: string]: number; // timeframe -> percentage
  };
}

// Trading activity types
export interface TradingActivity {
  totalTrades: number;
  uniqueWallets: number;
  buyVolume: number;
  sellVolume: number;
  buyTrades: number;
  sellTrades: number;
}

// Top holders types
export interface TopHolder {
  address: string;
  percentage: number;
  amount: number;
  value: number;
  isLargest?: boolean;
}

// Navigation types
export type RootStackParamList = {
  Main: undefined;
  TokenDetail: { tokenId: string };
  Portfolio: { address?: string };
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Tokens: undefined;
  Favorites: undefined;
  Portfolio: undefined;
};

// Filter and search types
export interface TokenFilters {
  searchQuery?: string;
  minMarketCap?: number;
  maxMarketCap?: number;
  minVolume?: number;
  maxVolume?: number;
  ageFilter?: 'all' | '1h' | '24h' | '7d' | '30d';
  sortBy?: 'marketCap' | 'volume' | 'change24h' | 'age';
  sortOrder?: 'asc' | 'desc';
}

// WebSocket types
export interface WebSocketMessage {
  type: 'price_update' | 'new_token' | 'volume_update';
  data: any;
}

export interface PriceUpdate {
  tokenId: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: number;
} 