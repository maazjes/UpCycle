import { useEffect } from 'react';
import { ChatPage } from '@shared/types';
import { getChats } from 'services/chats';
import { addChatPage } from 'reducers/chats';
import { useAppDispatch, useAppSelector } from './redux';

const useChats = (): [ChatPage | null, typeof fetchChats] => {
  const chatPage = useAppSelector((state): ChatPage | null => state.chats);
  const dispatch = useAppDispatch();

  const fetchChats = async (): Promise<ChatPage> => {
    const res = await getChats({ limit: 6, offset: chatPage?.offset || 0 });
    dispatch(addChatPage(res.data));
    return res.data;
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchChats();
    };
    initialize();
  }, []);

  return [chatPage, fetchChats];
};

export default useChats;
