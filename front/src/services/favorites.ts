import { AxiosResponse } from 'axios';
import { Favorite } from '@shared/types';
import api from '../util/axiosInstance';

const createFavorite = (body: { postId: number }): Promise<AxiosResponse<Favorite>> =>
  api.post<Favorite>('favorites', body);

const deleteFavorite = (favoriteId: number): Promise<AxiosResponse<undefined>> =>
  api.delete<undefined>(`favorites/${favoriteId}`);

export { createFavorite, deleteFavorite };
