import { AxiosResponse } from 'axios';
import { Category } from '@shared/types';
import api from '../util/axiosInstance';

const getCategories = (): Promise<AxiosResponse<Category[]>> => api.get<Category[]>('categories');

export { getCategories };
