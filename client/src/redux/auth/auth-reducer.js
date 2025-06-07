import { createSlice } from '@reduxjs/toolkit';
import {
  logIn,
  logOut,
  refreshUser,
  getUser,
  dailyRate
} from './auth-operations';

const initialState = {
  accessToken: null,
  refreshToken: null,
  sid: null,
  todaySummary: {},
  user: { userData: { dailyRate: null, notAllowedProducts: [] } },
  isLoggedIn: false,
  isRefreshing: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
      state.user = action.payload.user; 
    });
    
    builder.addCase(logOut.fulfilled, state => {
      state.accessToken = null;
      state.refreshToken = null;
      state.sid = null;
      state.todaySummary = {};
      state.user = { userData: { dailyRate: null, notAllowedProducts: [] } };
      state.isLoggedIn = false;
    });
    builder.addCase(refreshUser.pending, state => {
      state.isRefreshing = true;
    });
    builder.addCase(refreshUser.fulfilled, (state, action) => {
      state.accessToken = action.payload.accessToken; 
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    
    });
    builder.addCase(refreshUser.rejected, state => {
      state.isRefreshing = false;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isRefreshing = false;
    });
    builder.addCase(dailyRate.fulfilled, (state, action) => {
      state.user.userData.dailyRate = action.payload.dailyRate;
      state.user.userData.notAllowedProducts =
        action.payload.notAllowedProducts;
    });
  },
});
