import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'dark' | 'light';
  currency: 'USD' | 'ETH' | 'BTC';
  refreshInterval: number; // in seconds
  notifications: {
    priceAlerts: boolean;
    newTokens: boolean;
    portfolioUpdates: boolean;
  };
  defaultTimeframe: string;
  compactView: boolean;
  hapticFeedback: boolean;
  autoRefresh: boolean;
}

const initialState: SettingsState = {
  theme: 'dark',
  currency: 'USD',
  refreshInterval: 30,
  notifications: {
    priceAlerts: true,
    newTokens: false,
    portfolioUpdates: true,
  },
  defaultTimeframe: '24h',
  compactView: false,
  hapticFeedback: true,
  autoRefresh: true,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
    },
    setCurrency: (state, action: PayloadAction<'USD' | 'ETH' | 'BTC'>) => {
      state.currency = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    setNotifications: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setDefaultTimeframe: (state, action: PayloadAction<string>) => {
      state.defaultTimeframe = action.payload;
    },
    setCompactView: (state, action: PayloadAction<boolean>) => {
      state.compactView = action.payload;
    },
    setHapticFeedback: (state, action: PayloadAction<boolean>) => {
      state.hapticFeedback = action.payload;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    resetSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  setTheme,
  setCurrency,
  setRefreshInterval,
  setNotifications,
  setDefaultTimeframe,
  setCompactView,
  setHapticFeedback,
  setAutoRefresh,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 