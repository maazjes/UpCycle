import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TokenUser } from '../types';

const userSlice = createSlice({
  name: 'token',
  initialState: {
    token: '', email: '', id: -1
  },
  reducers: {
    addUser(_state, action: PayloadAction<TokenUser>): TokenUser {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
