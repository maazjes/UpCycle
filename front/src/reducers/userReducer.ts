import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TokenUser } from '@shared/types';
import { defaultUser } from '../util/constants';

const initialState: TokenUser = defaultUser;

const userSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    addUser(_state, action: PayloadAction<TokenUser>): TokenUser {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
