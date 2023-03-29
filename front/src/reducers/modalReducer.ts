import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modalVisible',
  initialState: false,
  reducers: {
    setVisible(_state, action: PayloadAction<boolean>): boolean {
      return action.payload;
    }
  }
});

export default modalSlice.reducer;
export const { setVisible } = modalSlice.actions;
