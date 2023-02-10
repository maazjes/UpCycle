import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import {
  User, GetUsersParams, TypedImage
} from '../types';
import { addParams, createFormData } from '../util/helpers';

export interface SignupResponse {
  id: string;
  bio?: string;
  photoUrl?: string;
  email: string;
  displayName: string;
}

type CreateUserParams = Omit<SignupResponse, 'id' | 'photoUrl'> & { image: TypedImage; password: string };

const createUser = async (params: CreateUserParams):
Promise<AxiosResponse<SignupResponse>> => {
  const formdata = createFormData(params);
  const response = await api.postForm<SignupResponse>('users', formdata);
  return response;
};

const getUsers = async (params: GetUsersParams): Promise<AxiosResponse<User[]>> => {
  const query = addParams('users', params);
  const users = await api.get<User[]>(query);
  return users;
};

const getUserById = async (id: number): Promise<AxiosResponse<User>> => {
  const user = await api.get<User>(`users/${id}`);
  return user;
};

export default { createUser, getUsers, getUserById };
