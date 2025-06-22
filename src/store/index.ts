import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import API slices
import { apiSlice } from '../store/api/apiSlice';
import { believeScreenerApi } from '../store/api/believeScreenerApi';

// Import feature slices
import tokensReducer from '../store/slices/tokensSlice';
import portfolioReducer from '../store/slices/portfolioSlice';
import dashboardReducer from '../store/slices/dashboardSlice';
import favoritesReducer from '../store/slices/favoritesSlice';
import settingsReducer from '../store/slices/settingsSlice';

export const store = configureStore({
  reducer: {
    // API slices
    [apiSlice.reducerPath]: apiSlice.reducer,
    [believeScreenerApi.reducerPath]: believeScreenerApi.reducer,
    
    // Feature slices
    tokens: tokensReducer,
    portfolio: portfolioReducer,
    dashboard: dashboardReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore RTK Query actions
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
          // Ignore Believe Screener API actions
          'believeScreenerApi/executeQuery/pending',
          'believeScreenerApi/executeQuery/fulfilled',
          'believeScreenerApi/executeQuery/rejected',
        ],
      },
    })
    .concat(apiSlice.middleware)
    .concat(believeScreenerApi.middleware),
  devTools: __DEV__,
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store; 