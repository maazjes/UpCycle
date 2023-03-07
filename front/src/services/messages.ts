import { AxiosResponse } from 'axios';
import { MessageBody, Message, MessagePage } from '@shared/types';
import { GetMessagesQuery } from '../types';
import api from '../util/axiosInstance';
import { addQuery } from '../util/helpers';

const createMessage = (body: MessageBody): Promise<AxiosResponse<Message>> => api.post<Message>('messages', body);

const getMessages = (query: GetMessagesQuery): Promise<AxiosResponse<MessagePage>> => {
  const finalQuery = addQuery('messages', query);
  return api.get<MessagePage>(finalQuery);
};

export default { createMessage, getMessages };
