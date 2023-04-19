import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Post } from '@shared/types';

const singlePostSlice = createSlice({
  name: 'singlePost',
  initialState: null as Post | null,
  reducers: {
    setSinglePost(_state, action: PayloadAction<Post | null>): Post | null {
      return action.payload;
    },
    editSinglePost(state, action: PayloadAction<Partial<Post>>): Post | null {
      if (!state) {
        return null;
      }
      return { ...state, ...action.payload };
    }
  }
});

export default singlePostSlice.reducer;
export const { setSinglePost, editSinglePost } = singlePostSlice.actions;
