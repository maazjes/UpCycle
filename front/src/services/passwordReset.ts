import { AxiosResponse } from 'axios';
import {
  PasswordResetBody,
  PasswordResetConfirmationBody,
  PasswordResetVerifyBody
} from '@shared/types';
import api from '../util/axiosInstance';

const sendPasswordResetEmail = (body: PasswordResetBody): Promise<AxiosResponse<undefined>> =>
  api.post<undefined>('passwordreset/sendemail', body);

const verifyPasswordResetCode = (
  body: PasswordResetVerifyBody
): Promise<AxiosResponse<undefined>> => api.post<undefined>('passwordreset/verifycode', body);

const confirmPasswordReset = (
  body: PasswordResetConfirmationBody
): Promise<AxiosResponse<undefined>> => api.post<undefined>('passwordreset/confirm', body);

export { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset };
