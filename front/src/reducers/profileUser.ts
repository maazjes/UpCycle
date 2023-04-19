import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@shared/types';

const profileSlice = createSlice({
  name: 'profileUser',
  initialState: null as User | null,
  reducers: {
    setUser(_state, action: PayloadAction<User | null>): User | null {
      if (!action.payload) {
        return null;
      }
      const newUser = { ...action.payload };
      return newUser;
    },
    editUser(state, action: PayloadAction<Partial<User>>): User | null {
      if (!state) {
        return null;
      }
      return { ...state, ...action.payload };
    },
    removeFollowing(state): User | null {
      if (!state) {
        return null;
      }
      return { ...state, following: state.following - 1 };
    },
    addFollowing(state): User | null {
      if (!state) {
        return null;
      }
      return { ...state, following: state.following + 1 };
    }
  }
});

export default profileSlice.reducer;
export const { setUser, editUser, removeFollowing, addFollowing } = profileSlice.actions;
