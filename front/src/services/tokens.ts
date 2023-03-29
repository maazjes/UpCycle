import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';

const refreshIdToken = (body: {
  refreshToken: string;
}): Promise<AxiosResponse<{ idToken: string }>> =>
  api.post<{ idToken: string }>('refreshidtoken', body);

const verifyIdToken = (body: { idToken: string }): Promise<AxiosResponse<undefined>> =>
  api.post<undefined>('verifyidtoken', body);

export { refreshIdToken, verifyIdToken };
