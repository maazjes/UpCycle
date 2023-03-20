import { AxiosResponse } from 'axios';
import { MessageBody, Message, MessagePage } from '@shared/types';
import { GetMessagesQuery } from '../types';
import api from '../util/axiosInstance';
import { addQuery, createFormData } from '../util/helpers';

const createMessage = (body: MessageBody): Promise<AxiosResponse<Message>> => {
  const formData = createFormData(body);
  return api.postForm<Message>('messages', formData);
};

const getMessages = (
  query: GetMessagesQuery
): Promise<AxiosResponse<MessagePage>> => {
  const finalQuery = addQuery('messages', query);
  return api.get<MessagePage>(finalQuery);
};

export { createMessage, getMessages };
