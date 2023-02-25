import { AxiosResponse } from 'axios';
import { Chat } from '../types';
import api from '../util/axiosInstance';

const refreshToken = async (): Promise<AxiosResponse<Chat[]>> => {
  const response = await api.get<Chat[]>('refreshtoken');
  return response;
};

export default { refreshToken };
