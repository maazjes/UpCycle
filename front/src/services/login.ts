import { AxiosResponse } from 'axios';
import { TokenUser } from '../types';
import api from '../util/axiosInstance';

const login = async (username: string, password: string):
Promise<AxiosResponse<TokenUser>> => {
  const response = await api.post('login', { username, password });
  return response;
};

export default { login };
