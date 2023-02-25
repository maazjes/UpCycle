import { AxiosResponse } from 'axios';
import { Chat } from '../types';
import { addParams } from '../util/helpers';
import api from '../util/axiosInstance';

const getChats = async (params: { userId: string }): Promise<AxiosResponse<Chat[]>> => {
  const query = addParams('chats', params);
  const response = await api.get<Chat[]>(query);
  return response;
};

export default { getChats };
