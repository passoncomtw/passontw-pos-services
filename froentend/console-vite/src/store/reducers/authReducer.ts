import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    username: string;
    role: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: {
      prepare: (credentials: LoginCredentials) => ({ payload: credentials }),
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      }
    },
    loginSuccess: (state, action: PayloadAction<AuthState['user']>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer; 