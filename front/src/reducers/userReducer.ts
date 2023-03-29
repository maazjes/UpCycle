import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProfileProps } from 'types';

const userSlice = createSlice({
  name: 'userId',
  initialState: null as null | ProfileProps,
  reducers: {
    setProfileProps(_state, action: PayloadAction<ProfileProps | null>): ProfileProps | null {
      return action.payload;
    }
  }
});

export default userSlice.reducer;
export const { setProfileProps } = userSlice.actions;
