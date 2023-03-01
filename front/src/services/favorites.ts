import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';

interface Favorite {
  id: number;
  postId: number;
  userId: string;
}

const addFavorite = async (postId: number): Promise<AxiosResponse<Favorite>> => {
  const favorite = await api.post<Favorite>('favorites', { postId });
  return favorite;
};

const removeFavorite = async (id: number):
Promise<AxiosResponse<undefined>> => {
  const favorite = await api.delete<undefined>(`favorites/${id}`);
  return favorite;
};

const getFavorites = async (): Promise<AxiosResponse<Favorite[]>> => {
  const favorite = await api.get<Favorite[]>('favorites');
  return favorite;
};

export { addFavorite, removeFavorite, getFavorites };
