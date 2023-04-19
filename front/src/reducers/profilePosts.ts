import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PostBase, PostPage } from '@shared/types';
import { emptyPage } from 'util/constants';
import { concatPages } from 'util/helpers';

const profilePostsSlice = createSlice({
  name: 'profilePosts',
  initialState: null as PostPage | null,
  reducers: {
    setPosts(_state, action: PayloadAction<PostPage | null>): PostPage | null {
      return action.payload;
    },
    removePost(state, action: PayloadAction<number>): PostPage | null {
      if (!state) {
        return null;
      }
      const { offset, totalItems, data } = { ...state };
      return {
        offset: offset - 1,
        totalItems: totalItems - 1,
        data: data.filter((post): boolean => post.id !== action.payload)
      };
    },
    addPostPage(state, action: PayloadAction<PostPage>): PostPage {
      return concatPages(state || { ...emptyPage }, action.payload);
    },
    addPost(state, action: PayloadAction<PostBase>): PostPage | null {
      if (!state) {
        return null;
      }
      const { offset, totalItems, data } = { ...state };
      return {
        offset: offset + 1,
        totalItems: totalItems + 1,
        data: [action.payload, ...data]
      };
    },
    editPost(
      state,
      action: PayloadAction<Omit<Partial<PostBase>, 'id'> & { id: number }>
    ): PostPage | null {
      if (!state) {
        return null;
      }
      const { offset, totalItems, data } = { ...state };
      return {
        offset,
        totalItems,
        data: data.map(
          (post): PostBase =>
            post.id !== action.payload.id ? post : { ...post, ...action.payload }
        )
      };
    }
  }
});

export default profilePostsSlice.reducer;
export const { setPosts, removePost, addPostPage, addPost, editPost } = profilePostsSlice.actions;
