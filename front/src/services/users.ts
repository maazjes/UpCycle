import { AxiosResponse } from 'axios';
import { EmailUser, User } from '@shared/types';
import { UpdateUserBody, NewUserBody } from 'types';
import api from '../util/axiosInstance';
import { createFormData } from '../util/helpers';

const createUser = (body: NewUserBody): Promise<AxiosResponse<EmailUser>> => {
  const formdata = createFormData(body);
  return api.postForm<EmailUser>('users', formdata);
};

const getUser = (userId: string): Promise<AxiosResponse<User>> => api.get<User>(`users/${userId}`);

const updateUser = (userId: string, body: UpdateUserBody): Promise<AxiosResponse<EmailUser>> => {
  const formdata = createFormData(body);
  return api.putForm<EmailUser>(`users/${userId}`, formdata);
};

export { createUser, getUser, updateUser };
