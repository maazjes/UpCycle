import { AxiosResponse } from 'axios';
import api from '../util/axiosInstance';
import { User } from '../types';

interface RegistrationResponse {
  username: string;
  name: string;
}
const register = async (username: string, name: string, password: string):
Promise<AxiosResponse<RegistrationResponse>> => {
  const response = await api.post('users', { username, name, password });
  return response;
};

const getUsers = async (): Promise<AxiosResponse<User[]>> => {
  const users = await api.get('users');
  return users;
};

const getUserById = async (id: number): Promise<AxiosResponse<User>> => {
  const user = await api.get(`users/${id}`);
  return user;
};

export default { register, getUsers, getUserById };
