import axios, { AxiosResponse } from 'axios';
import { User } from '../types';

const baseUrl = 'http://192.168.0.104:8080/api/users';

interface RegistrationResponse {
  username: string;
  name: string;
}
const register = async (username: string, name: string, password: string):
Promise<AxiosResponse<RegistrationResponse>> => {
  const response = await axios.post(`${baseUrl}`, { username, name, password });
  return response;
};

const getUsers = async (): Promise<AxiosResponse<User[]>> => {
  const users = await axios.get(baseUrl);
  return users;
};

const getUserById = async (id: number): Promise<AxiosResponse<User>> => {
  const user = await axios.get(`${baseUrl}/${id}`);
  return user;
};

export default { register, getUsers, getUserById };
