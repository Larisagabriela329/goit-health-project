import { createSlice } from '@reduxjs/toolkit';
import { deleteProduct, dayInfo, postProduct } from './day-operations';

const initialState = {
  id: null,
  eatenProducts: [],
  date: '',
  notAllowedProducts: [],
  daySummary: {
    kcalLeft: 0,
    kcalConsumed: 0,
    dailyRate: 0,
    percentsOfDailyRate: 0,
  },
};

export const daySlice = createSlice({
  name: 'day',
  initialState,
  extraReducers: builder => {
    builder
    .addCase(postProduct.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.eatenProducts = action.payload.eatenProducts;
      state.date = action.payload.date;
      state.daySummary = action.payload.daySummary;
    })
    .addCase(deleteProduct.fulfilled, (state, action) => {
      state.daySummary = action.payload.daySummary;
      state.eatenProducts = action.payload.eatenProducts;
    })
    .addCase(dayInfo.fulfilled, (state, action) => {
      state.notAllowedProducts = Array.isArray(action.payload?.notAllowedProducts)
        ? action.payload.notAllowedProducts
        : [];
    });
    
  },
});

export const dayReducer = daySlice.reducer;
