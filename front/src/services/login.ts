import { AxiosResponse } from 'axios';
import { TokenUser, LoginBody } from '@shared/types';
import api from '../util/axiosInstance';

const login = async (credentials: LoginBody):
Promise<AxiosResponse<TokenUser>> => {
  const response = await api.post<TokenUser>('login', credentials);
  return response;
};

export default { login };
