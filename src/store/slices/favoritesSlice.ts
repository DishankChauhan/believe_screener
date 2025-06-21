import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  tokenIds: string[];
  portfolioAddresses: string[];
  isLoaded: boolean;
}

const initialState: FavoritesState = {
  tokenIds: [],
  portfolioAddresses: [],
  isLoaded: false,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addTokenToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.tokenIds.includes(action.payload)) {
        state.tokenIds.push(action.payload);
      }
    },
    removeTokenFromFavorites: (state, action: PayloadAction<string>) => {
      state.tokenIds = state.tokenIds.filter(id => id !== action.payload);
    },
    setFavoriteTokens: (state, action: PayloadAction<string[]>) => {
      state.tokenIds = action.payload;
    },
    addPortfolioToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.portfolioAddresses.includes(action.payload)) {
        state.portfolioAddresses.push(action.payload);
      }
    },
    removePortfolioFromFavorites: (state, action: PayloadAction<string>) => {
      state.portfolioAddresses = state.portfolioAddresses.filter(addr => addr !== action.payload);
    },
    setFavoritePortfolios: (state, action: PayloadAction<string[]>) => {
      state.portfolioAddresses = action.payload;
    },
    setFavoritesLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
    clearAllFavorites: (state) => {
      state.tokenIds = [];
      state.portfolioAddresses = [];
    },
  },
});

export const {
  addTokenToFavorites,
  removeTokenFromFavorites,
  setFavoriteTokens,
  addPortfolioToFavorites,
  removePortfolioFromFavorites,
  setFavoritePortfolios,
  setFavoritesLoaded,
  clearAllFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 