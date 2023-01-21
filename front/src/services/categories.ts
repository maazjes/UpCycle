import axios, { AxiosResponse } from 'axios';
import { Category } from '../types';

const baseUrl = 'http://192.168.0.104:8080/api/categories';

const getCategories = async (): Promise<AxiosResponse<Category[]>> => {
  try {
    const response = await axios.get(`${baseUrl}`);
    return response;
  } catch (e) {
    throw new Error(`Getting posts failed ${e}`);
  }
};

export default { getCategories };
