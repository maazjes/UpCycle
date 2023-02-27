import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';

const refreshIdToken = async (body:
{ refreshToken: string }): Promise<AxiosResponse<{ idToken: string }>> => {
  const response = await api.post<{ idToken: string }>('refreshidtoken', body);
  return response;
};

const verifyToken = async (body: { idToken: string }):
Promise<AxiosResponse<{}>> => {
  const response = await api.post<{}>('verifyidtoken', body);
  return response;
};

export default { refreshIdToken, verifyToken };
