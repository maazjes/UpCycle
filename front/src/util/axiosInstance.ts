import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorBody } from '@shared/types';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL || 'https://upcycleapi.herokuapp.com/',
  timeout: 1000
});

api.defaults.timeout = 20000;

api.interceptors.response.use(
  (response): AxiosResponse => response,
  (error: AxiosError<ErrorBody>): Promise<never> | string => {
    if (error.response?.data.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

export default api;
