import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
  name: 'loggedIn',
  initialState: false,
  reducers: {
    setLoggedIn(_state, action: PayloadAction<boolean>): boolean {
      return action.payload;
    }
  }
});

export default loginSlice.reducer;
export const { setLoggedIn } = loginSlice.actions;
