import { AxiosResponse } from 'axios';
import { MessageBody, GetMessagesRes } from '@shared/types';
import { Message, GetMessagesQuery } from '../types';
import api from '../util/axiosInstance';
import { addParams } from '../util/helpers';

const createMessage = async (body: MessageBody): Promise<AxiosResponse<Message>> => {
  const response = await api.post<Message>('messages', body);
  return response;
};

const getMessages = async (params: GetMessagesQuery): Promise<AxiosResponse<GetMessagesRes>> => {
  const query = addParams('messages', params);
  const response = await api.get<GetMessagesRes>(query);
  return response;
};

export default { createMessage, getMessages };
