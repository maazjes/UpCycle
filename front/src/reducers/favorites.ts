import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Post, PostPage } from '@shared/types';
import { emptyPage } from 'util/constants';
import { concatPages } from 'util/helpers';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: null as PostPage | null,
  reducers: {
    setFavorites(_state, action: PayloadAction<PostPage | null>): PostPage | null {
      return action.payload;
    },
    removeFavorite(state, action: PayloadAction<number>): PostPage | null {
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
    addFavoritesPage(state, action: PayloadAction<PostPage>): PostPage {
      return concatPages(state || { ...emptyPage }, action.payload);
    },
    addFavorite(state, action: PayloadAction<Post>): PostPage | null {
      if (!state) {
        return null;
      }
      const { offset, totalItems, data } = { ...state };
      return {
        offset: offset + 1,
        totalItems: totalItems + 1,
        data: data.concat(action.payload)
      };
    }
  }
});

export default favoritesSlice.reducer;
export const { setFavorites, removeFavorite, addFavoritesPage, addFavorite } =
  favoritesSlice.actions;
