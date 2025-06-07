import { createSlice } from '@reduxjs/toolkit';

export const modalSlice = createSlice({
  name: 'modal',
  initialState: false,
  reducers: { toggleModal: (state) => !state, },
});

export const { toggleModal } = modalSlice.actions;
