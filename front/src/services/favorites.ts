import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';

interface Favorite {
  id: number;
  postId: number;
  userId: number;
}

const addToFavorites = async (postId: number): Promise<AxiosResponse<Favorite>> => {
  const favorite = await api.post<Favorite>('favorites', { postId });
  return favorite;
};

const removeFromFavorites = async (id: number):
Promise<AxiosResponse<Favorite>> => {
  const favorite = await api.delete<Favorite>(`favorites/${id}`);
  return favorite;
};

const getFavorites = async (): Promise<AxiosResponse<Favorite[]>> => {
  const favorite = await api.get<Favorite[]>('favorites');
  return favorite;
};

export { addToFavorites, removeFromFavorites, getFavorites };
