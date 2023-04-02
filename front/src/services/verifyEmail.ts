import { AxiosResponse } from 'axios';
import { CheckEmailVerifiedBody, EmailVerifyBody, FirebaseUser } from '@shared/types';
import api from '../util/axiosInstance';

const verifyEmail = (body: EmailVerifyBody): Promise<AxiosResponse<FirebaseUser>> =>
  api.post<FirebaseUser>('verifyemail/sendemail', body);

const checkEmailVerified = (
  body: EmailVerifyBody
): Promise<AxiosResponse<CheckEmailVerifiedBody>> =>
  api.post<CheckEmailVerifiedBody>('verifyemail/checkverified', body);

export { verifyEmail, checkEmailVerified };
