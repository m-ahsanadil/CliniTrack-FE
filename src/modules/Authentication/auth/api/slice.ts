import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SuperAdminUser, UserInfo } from "./types";

interface AuthState {
  user: UserInfo | null;
  superAdminUser: SuperAdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loginLoading: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loginLoading: false,
  loginError: null,
  superAdminUser: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.superAdminUser = null;
      state.isAuthenticated = true;
      state.loginError = null;
    },
    setSuperAdminCredentials: (
      state,
      action: PayloadAction<{ user: SuperAdminUser; token: string }>
    ) => {
      state.superAdminUser = action.payload.user;
      state.user = null;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loginError = null;
    },


    logout: (state) => {
      state.user = null;
      state.superAdminUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.loginLoading = false;
    },

    // Additional logout actions for different scenarios
    logoutSuccess: (state) => {
      state.user = null;
      state.superAdminUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginError = null;
      state.loginLoading = false;
    },

    sessionExpired: (state) => {
      state.user = null;
      state.superAdminUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loginError = "Session expired. Please login again.";
      state.loginLoading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loginLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
    },

    clearError: (state) => {
      state.loginError = null;
    },
  },
});

export const {
  setCredentials,
  setSuperAdminCredentials,
  logout,
  logoutSuccess,
  sessionExpired,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;