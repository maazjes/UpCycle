import { AxiosResponse } from 'axios';
import { ChatPage, RawChat, UpdateChatBody } from '@shared/types';
import { PaginationQuery } from 'types';
import { addQuery } from 'util/helpers';
import api from '../util/axiosInstance';

const getChats = (query: PaginationQuery): Promise<AxiosResponse<ChatPage>> => {
  const finalQuery = addQuery('chats', query);
  return api.get<ChatPage>(finalQuery);
};

const updateChat = (chatId: number, body: UpdateChatBody): Promise<AxiosResponse<RawChat>> =>
  api.put(`chats/${chatId}`, body);

export { getChats, updateChat };
