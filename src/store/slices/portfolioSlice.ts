import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Portfolio } from '../../types';

interface PortfolioState {
  currentPortfolio: Portfolio | null;
  trackedAddresses: string[];
  selectedAddress: string | null;
  isLoading: boolean;
}

const initialState: PortfolioState = {
  currentPortfolio: null,
  trackedAddresses: [],
  selectedAddress: null,
  isLoading: false,
};

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setCurrentPortfolio: (state, action: PayloadAction<Portfolio | null>) => {
      state.currentPortfolio = action.payload;
    },
    addTrackedAddress: (state, action: PayloadAction<string>) => {
      if (!state.trackedAddresses.includes(action.payload)) {
        state.trackedAddresses.push(action.payload);
      }
    },
    removeTrackedAddress: (state, action: PayloadAction<string>) => {
      state.trackedAddresses = state.trackedAddresses.filter(addr => addr !== action.payload);
    },
    setTrackedAddresses: (state, action: PayloadAction<string[]>) => {
      state.trackedAddresses = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<string | null>) => {
      state.selectedAddress = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCurrentPortfolio,
  addTrackedAddress,
  removeTrackedAddress,
  setTrackedAddresses,
  setSelectedAddress,
  setLoading,
} = portfolioSlice.actions;

export default portfolioSlice.reducer; 