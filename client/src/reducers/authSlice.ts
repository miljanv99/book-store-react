import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('authToken', action.payload);
      sessionStorage.setItem('authToken', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    },
    loadToken: (state) => {
      state.token =
        localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || null;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setToken, clearToken, loadToken } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.authorization.token;


export default authSlice.reducer;
