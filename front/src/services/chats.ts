import { AxiosResponse } from 'axios';
import { Chat, ChatPage } from '@shared/types';
import { PaginationQuery } from 'types';
import { addQuery } from 'util/helpers';
import api from '../util/axiosInstance';

const getChats = (query: PaginationQuery): Promise<AxiosResponse<ChatPage>> => {
  const finalQuery = addQuery('chats', query);
  return api.get<ChatPage>(finalQuery);
};

const getChat = (chatId: number): Promise<AxiosResponse<Chat>> => api.get<Chat>(`chats/${chatId}`);

export { getChats, getChat };
