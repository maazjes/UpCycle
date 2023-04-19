import { AxiosResponse } from 'axios';
import { EmailUser, GetUsersQuery, User, UserBase } from '@shared/types';
import { FinalNewUserBody, FinalUpdateUserBody } from 'types';
import api from '../util/axiosInstance';
import { addQuery, createFormData } from '../util/helpers';

const createUser = (body: FinalNewUserBody): Promise<AxiosResponse<EmailUser>> => {
  const formdata = createFormData(body);
  return api.postForm<EmailUser>('users', formdata);
};

const getUser = (userId: string): Promise<AxiosResponse<User>> => api.get<User>(`users/${userId}`);

const getUsers = (query: GetUsersQuery): Promise<AxiosResponse<UserBase[]>> =>
  api.get<UserBase[]>(addQuery('users', query));

const updateUser = (
  userId: string,
  body: FinalUpdateUserBody
): Promise<AxiosResponse<EmailUser>> => {
  const formdata = createFormData(body);
  return api.putForm<EmailUser>(`users/${userId}`, formdata);
};

export { createUser, getUser, getUsers, updateUser };
