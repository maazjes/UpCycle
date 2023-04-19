import { useEffect } from 'react';
import { PostPage } from '@shared/types';
import { addFavoritesPage } from 'reducers/favorites';
import { getPosts } from '../services/posts';
import { useAppDispatch, useAppSelector } from './redux';

const useFavorites = (): [PostPage | null, typeof fetchFavorites] => {
  const postPage = useAppSelector((state): PostPage | null => state.favorites);
  const dispatch = useAppDispatch();

  const fetchFavorites = async (): Promise<void> => {
    const res = await getPosts({
      limit: 6,
      offset: postPage?.offset || 0,
      favorite: 'true'
    });
    dispatch(addFavoritesPage(res.data));
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchFavorites();
    };
    initialize();
  }, []);

  return [postPage, fetchFavorites];
};

export default useFavorites;
