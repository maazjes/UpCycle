import { AxiosResponse } from 'axios';
import { Favorite } from '@shared/types';
import api from '../util/axiosInstance';

const addFavorite = (body: { postId: number }): Promise<AxiosResponse<Favorite>> => api.post<Favorite>('favorites', body);

const removeFavorite = (favoriteId: number):
Promise<AxiosResponse<undefined>> => api.delete<undefined>(`favorites/${favoriteId}`);

export { addFavorite, removeFavorite };
