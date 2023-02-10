import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorResponse } from '../types';

const api = axios.create({
  baseURL: 'http://192.168.0.104:8080/api/',
  timeout: 1000
});

api.interceptors.response.use(
  (response): AxiosResponse => response,
  (error: AxiosError<ErrorResponse>): Promise<never> | string => {
    if (error.response?.data.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

export default api;
