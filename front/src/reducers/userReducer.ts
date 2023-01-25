import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '../types';

const userSlice = createSlice({
  name: 'token',
  initialState: {
    token: '', username: '', name: '', id: -1
  },
  reducers: {
    addUser(_state, action: PayloadAction<User>): User {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
