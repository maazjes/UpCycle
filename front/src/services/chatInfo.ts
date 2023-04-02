import { RawChatInfo, UpdateChatInfoBody } from '@shared/types';
import { AxiosResponse } from 'axios';
import api from 'util/axiosInstance';

const updateChatInfo = (
  chatId: number,
  body: UpdateChatInfoBody
): Promise<AxiosResponse<RawChatInfo>> => api.put(`chatinfo/${chatId}`, body);

export { updateChatInfo };
