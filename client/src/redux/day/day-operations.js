import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'config';

export const postProduct = createAsyncThunk(
  'day/postProduct',
  async (body, { rejectWithValue }) => {
    try {
      const { date, ...productData } = body;
      const product = await instance.post(`/day/${date}/consumed`, productData);
      return product.data;
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
      const product = await instance.delete(`/day/${date}/consumed/${productId}`);
      return product.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dayInfo = createAsyncThunk(
  'day/info',
  async (body, { rejectWithValue }) => {
    try {
      const dayInfo = await instance.get(`/day/${body.date}`);
      if (dayInfo.data.id) {
        return dayInfo.data;
      }
      const info = {
        date: body.date,
        daySummary: {
          date: body.date,
          kcalLeft: dayInfo.data.kcalLeft,
          kcalConsumed: dayInfo.data.kcalConsumed,
          dailyRate: dayInfo.data.dailyRate,
          percentsOfDailyRate: dayInfo.data.percentsOfDailyRate,
        },
        eatenProducts: [],
        id: null,
      };
      return info;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
