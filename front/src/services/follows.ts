import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';

interface Follow {
  id: number;
  followerId: string;
  followedId: string;
}

const follow = async (postId: number): Promise<AxiosResponse<Follow>> => {
  const Follow = await api.post<Follow>('follows', { postId });
  return Follow;
};

const unfollow = async ({}):
Promise<AxiosResponse<undefined>> => {
  const Follow = await api.delete<undefined>(`follows/${id}`);
  return Follow;
};

export { follow, unfollow };
