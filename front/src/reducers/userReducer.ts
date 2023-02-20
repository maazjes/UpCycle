import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TokenUser } from '../types';

type SliceState = TokenUser | null;

const userSlice = createSlice({
  name: 'token',
  initialState: null as SliceState,
  reducers: {
    addUser(_state, action: PayloadAction<TokenUser | null>): TokenUser | null {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
