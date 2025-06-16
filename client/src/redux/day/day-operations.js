import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'config';

export const postProduct = createAsyncThunk(
  'day/postProduct',
  async (body, { rejectWithValue }) => {
    try {
      const { date, ...productData } = body;
      const response = await instance.post(`/api/private/day/${date}/consumed`, productData);
      return {
        id: response.data._id,
        eatenProducts: response.data.consumedProducts,
        date: response.data.date,
        daySummary: response.data.daySummary,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'day/deleteProduct',
  async (body, { rejectWithValue }) => {
    try {
      const { date, productId } = body;
      const res = await instance.delete(`/api/private/day/${date}/consumed/${productId}`);
      return {
        id: null,
        eatenProducts: res.data.consumedProducts,
        date,
        daySummary: res.data.daySummary,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dayInfo = createAsyncThunk(
  'day/info',
  async (body, { rejectWithValue }) => {
    try {
      const res = await instance.get(`/api/private/day/${body.date}`);
      const data = res.data;

      return {
        id: null,
        eatenProducts: data.consumedProducts || [],
        date: body.date,
        daySummary: data.daySummary || {
          date: body.date,
          kcalLeft: 0,
          kcalConsumed: 0,
          dailyRate: 0,
          percentsOfDailyRate: 0,
        },
        notAllowedProducts: data.notAllowedProducts || [], 
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
