import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import cartCounterReducer from './reducers/cartSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage
};

// Apply redux-persist with auth reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedCartCounterReducer = persistReducer(persistConfig, cartCounterReducer);

export const store = configureStore({
  reducer: {
    authorization: persistedAuthReducer,
    cartCounterItem: persistedCartCounterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore the persist actions that may include non-serializable data
        ignoredPaths: ['authorization'] // Optionally, you can ignore certain paths in the state if needed
      }
    })
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
