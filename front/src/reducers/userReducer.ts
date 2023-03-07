import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TokenUser } from '@shared/types';

const userSlice = createSlice({
  name: 'token',
  initialState: null as TokenUser | null,
  reducers: {
    addUser(_state, action: PayloadAction<TokenUser | null>): TokenUser | null {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
