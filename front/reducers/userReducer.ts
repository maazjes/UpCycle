import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface User {
  username: string;
  token: string;
}

const userSlice = createSlice({
  name: 'token',
  initialState: { token: '', username: '' },
  reducers: {
    addUser(_state, action: PayloadAction<User>): User {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { addUser } = userSlice.actions;
