import { AxiosResponse } from 'axios';
import { Message, MessagesResponse } from '../types';
import api from '../util/axiosInstance';
import { addParams } from '../util/helpers';

interface MessageBody {
  receiverId: string;
  content: string;
}

type GetMessagesParams = {
  userId1: string;
  userId2: string;
  page: number;
  size: number;
};

const createMessage = async (body: MessageBody): Promise<AxiosResponse<Message>> => {
  const response = await api.post<Message>('messages', body);
  return response;
};

const getMessages = async (params: GetMessagesParams): Promise<AxiosResponse<MessagesResponse>> => {
  const query = addParams('messages', params);
  const response = await api.get<MessagesResponse>(query);
  return response;
};

export default { createMessage, getMessages };
