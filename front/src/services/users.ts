import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import {
  User, GetUsersParams
} from '../types';
import { addParams, createFormData } from '../util/helpers';

export interface SignupResponse {
  id: string;
  bio?: string;
  photoUrl?: string;
  email: string;
  displayName: string;
}

type CreateUserProps = Omit<SignupResponse, 'id' | 'photoUrl'> & { image: { uri: string }; password: string };

type UpdateUserProps = Partial<CreateUserProps>;

const createUser = async (props: CreateUserProps):
Promise<AxiosResponse<SignupResponse>> => {
  const formdata = createFormData(props);
  const response = await api.postForm<SignupResponse>('users', formdata);
  return response;
};

const getUsers = async (params: GetUsersParams): Promise<AxiosResponse<User[]>> => {
  const query = addParams('users', params);
  const users = await api.get<(User & { email?: string })[]>(query);
  return users;
};

const getUser = async ({ userId }: { userId: string }): Promise<AxiosResponse<User>> => {
  const user = await api.get<User>(`users/${userId}`);
  return user;
};

const updateUser = async (props: UpdateUserProps): Promise<AxiosResponse<User>> => {
  const formdata = createFormData(props);
  const user = await api.putForm<User>('users', formdata);
  return user;
};

export {
  createUser, getUsers, getUser, updateUser
};
