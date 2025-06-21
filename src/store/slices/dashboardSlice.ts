import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardMetrics } from '../../types';

interface DashboardState {
  metrics: DashboardMetrics | null;
  lastUpdated: number | null;
  isRefreshing: boolean;
}

const initialState: DashboardState = {
  metrics: null,
  lastUpdated: null,
  isRefreshing: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload;
      state.lastUpdated = Date.now();
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    clearMetrics: (state) => {
      state.metrics = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  setMetrics,
  setRefreshing,
  clearMetrics,
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 