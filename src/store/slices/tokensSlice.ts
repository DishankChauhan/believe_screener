import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token, TokenFilters } from '../../types';

interface TokensState {
  selectedToken: Token | null;
  favorites: string[]; // token IDs
  filters: TokenFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  activeCategory: 'top75' | 'new_launches' | 'favorites';
}

const initialState: TokensState = {
  selectedToken: null,
  favorites: [],
  filters: {},
  sortBy: 'marketCap',
  sortOrder: 'desc',
  searchQuery: '',
  activeCategory: 'top75',
};

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setSelectedToken: (state, action: PayloadAction<Token | null>) => {
      state.selectedToken = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
    },
    setFilters: (state, action: PayloadAction<TokenFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<'top75' | 'new_launches' | 'favorites'>) => {
      state.activeCategory = action.payload;
    },
  },
});

export const {
  setSelectedToken,
  addToFavorites,
  removeFromFavorites,
  setFavorites,
  setFilters,
  clearFilters,
  setSorting,
  setSearchQuery,
  setActiveCategory,
} = tokensSlice.actions;

export default tokensSlice.reducer; 