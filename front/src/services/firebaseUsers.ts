import { NewFirebaseUserBody, FirebaseUser } from '@shared/types';
import { AxiosResponse } from 'axios';
import api from 'util/axiosInstance';

const createFirebaseUser = (body: NewFirebaseUserBody): Promise<AxiosResponse<FirebaseUser>> =>
  api.post<FirebaseUser>('firebaseusers', body);

export { createFirebaseUser };
