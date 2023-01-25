import axios, { AxiosResponse } from 'axios';
import { User } from '../types';

const baseUrl = 'http://192.168.0.104:8080/api/login';

const login = async (username: string, password: string):
Promise<AxiosResponse<User>> => {
  const response = await axios.post(`${baseUrl}`, { username, password });
  return response;
};

export default { login };
