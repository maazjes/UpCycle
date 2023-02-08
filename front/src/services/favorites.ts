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

export default { addToFavorites, removeFromFavorites };
