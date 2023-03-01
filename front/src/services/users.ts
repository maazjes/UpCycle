import { AxiosResponse } from 'axios';
import {
  FollowUser, NewUserBody, UpdateUserBody, UserBase, EmailUser
} from '@shared/types';
import { GetUsersQuery } from '../types';
import api from '../util/axiosInstance';
import { addParams, createFormData } from '../util/helpers';

const createUser = async (props: NewUserBody):
Promise<AxiosResponse<EmailUser>> => {
  const formdata = createFormData(props);
  const response = await api.postForm<EmailUser>('users', formdata);
  return response;
};

const getUsers = async (params: GetUsersQuery):
Promise<AxiosResponse<FollowUser[]>> => {
  const query = addParams('users', params);
  const users = await api.get<(FollowUser)[]>(query);
  return users;
};

const getUser = async ({ userId }: { userId: string }): Promise<AxiosResponse<UserBase>> => {
  const user = await api.get<UserBase>(`users/${userId}`);
  return user;
};

const updateUser = async (props: UpdateUserBody): Promise<AxiosResponse<UserBase>> => {
  const formdata = createFormData(props);
  const user = await api.putForm<UserBase>('users', formdata);
  return user;
};

export {
  createUser, getUsers, getUser, updateUser
};
