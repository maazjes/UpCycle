import { AxiosResponse } from 'axios';
import { TokenUser, LoginBody } from '@shared/types';
import api from '../util/axiosInstance';

const login = (body: LoginBody):
Promise<AxiosResponse<TokenUser>> => api.post<TokenUser>('login', body);

export default { login };
