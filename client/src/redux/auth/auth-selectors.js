import { createSelector } from '@reduxjs/toolkit';
import { getNotAllowedProducts } from '../../redux/day/day-selectors';

export const getIsLoggedIn = state => state.auth.isLoggedIn;

export const getIsRefreshing = state => state.auth.isRefreshing;

export const getUser = state => state.auth.user;
export const getUserData = state => state.auth.user?.userData || {};
export const getDailyRate = state => Number(state.auth.user.userData.dailyRate) || 0;


export const getDaily = createSelector(
  [getDailyRate, getNotAllowedProducts],
  (dailyRate, notAllowedProducts) => {
    return { dailyRate, notAllowedProducts };
  }
);
 