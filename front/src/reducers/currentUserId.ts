import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'currentUserId',
  initialState: null as null | string,
  reducers: {
    setCurrentUserId(_state, action: PayloadAction<string | null>): string | null {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { setCurrentUserId } = userSlice.actions;
