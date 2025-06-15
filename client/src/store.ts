import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import cartCounterReducer from './reducers/cartSlice';
import bookListReducer from './reducers/bookSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Separate persistConfig for auth (keep it persisted)
const persistConfigAuth = {
  key: 'auth', // Use a separate key for the auth data
  storage
};

// Separate persistConfig for cartCounter (exclude cartCounterItem from persistence)
const persistConfigCart = {
  key: 'cart',
  storage,
  blacklist: ['cartCounterItem'] // Do not persist cartCounterItem state
};

// Apply redux-persist with auth reducer
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);

// Apply redux-persist with cart reducer, but blacklist cartCounterItem
const persistedCartCounterReducer = persistReducer(persistConfigCart, cartCounterReducer);

const persistedBookListReducer = persistReducer(persistConfigCart, bookListReducer);

export const store = configureStore({
  reducer: {
    authorization: persistedAuthReducer,
    cartCounterItem: persistedCartCounterReducer,
    booksList: persistedBookListReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Ignore persist actions that may include non-serializable data
        ignoredPaths: ['authorization'] // Optionally, ignore paths in the state
      }
    })
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
