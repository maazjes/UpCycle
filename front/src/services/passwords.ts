import { AxiosResponse } from 'axios';
import { EmailBody, PasswordBody } from '@shared/types';
import api from '../util/axiosInstance';

const sendPasswordResetEmail = (body: EmailBody): Promise<AxiosResponse<undefined>> =>
  api.post<undefined>('passwords/sendresetemail', body);

const changePassword = (body: PasswordBody): Promise<AxiosResponse<undefined>> =>
  api.post<undefined>('passwords/changepassword', body);

export { sendPasswordResetEmail, changePassword };
