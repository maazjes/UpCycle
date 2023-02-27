import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserBase } from '@shared/types';

const userSlice = createSlice({
  name: 'token',
  initialState: {
    id: '', username: '', idToken: '', photoUrl: '', refreshToken: '', displayName: '', email: ''
  },
  reducers: {
    addUser(_state, action: PayloadAction<UserBase>): UserBase {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
