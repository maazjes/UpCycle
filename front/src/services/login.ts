import { AxiosResponse } from 'axios';
import { TokenUser } from '../types';
import api from '../util/axiosInstance';

const login = async (credentials: { email: string; password: string }):
Promise<AxiosResponse<TokenUser>> => {
  const response = await api.post<TokenUser>('login', credentials);
  return response;
};

export default { login };
