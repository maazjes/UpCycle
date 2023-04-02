import { AxiosResponse } from 'axios';
import { ChatPage } from '@shared/types';
import { PaginationQuery } from 'types';
import { addQuery } from 'util/helpers';
import api from '../util/axiosInstance';

const getChats = (query: PaginationQuery): Promise<AxiosResponse<ChatPage>> => {
  const finalQuery = addQuery('chats', query);
  return api.get<ChatPage>(finalQuery);
};

export { getChats };
