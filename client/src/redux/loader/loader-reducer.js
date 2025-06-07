import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: false,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        action => action.type.endsWith('/pending'),
        () => true
      )
      .addMatcher(
        action =>
          action.type.endsWith('/fulfilled') ||
          action.type.endsWith('/rejected'),
        () => false
      );
  },
});

export const loaderReducer = loaderSlice.reducer;
