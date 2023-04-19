import { AxiosResponse } from 'axios';
import { CheckEmailVerified, EmailBody, FirebaseUser } from '@shared/types';
import api from '../util/axiosInstance';

const verifyEmail = (body: EmailBody): Promise<AxiosResponse<FirebaseUser>> =>
  api.post<FirebaseUser>('emails/sendverificationemail', body);

const checkEmailVerified = (body: EmailBody): Promise<AxiosResponse<CheckEmailVerified>> =>
  api.post<CheckEmailVerified>('emails/checkverified', body);

const changeEmail = (body: EmailBody): Promise<AxiosResponse<CheckEmailVerified>> =>
  api.post<CheckEmailVerified>('emails/changeemail', body);

export { verifyEmail, checkEmailVerified, changeEmail };
