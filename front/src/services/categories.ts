import { AxiosResponse } from 'axios';
import { Category } from '@shared/types';
import api from '../util/axiosInstance';

const getCategories = async (): Promise<AxiosResponse<Category[]>> => {
  const response = await api.get<Category[]>('categories');
  return response;
};

export default { getCategories };
