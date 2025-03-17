import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface UserData {
  isAdmin: boolean;
  username: string;
  avatar: string;
}

interface AuthState {
  token: string | null;
  userData: UserData;
}

const initialState: AuthState = {
  token: null,
  userData: {
    isAdmin: false,
    username: '',
    avatar: ''
  }
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      state.userData.isAdmin = action.payload.isAdmin;
      state.userData.username = action.payload.username;
      state.userData.avatar = action.payload.avatar;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setToken, clearToken, setUserData } = authSlice.actions;

export const selectAuthToken = (state: RootState) => state.authorization.token;
export const selectUserData = (state: RootState) => state.authorization.userData;

export default authSlice.reducer;
