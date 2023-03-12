import { useRef, useState, useEffect } from 'react';
import { ChatPage } from '@shared/types';
import { emptyPage } from 'util/constants';
import { getChats } from 'services/chats';
import { concatPages } from 'util/helpers';

const useChats = (): [ChatPage | null, typeof fetchChats] => {
  const [chats, setChats] = useState<ChatPage | null>(null);
  const offset = useRef(0);

  const fetchChats = async (): Promise<ChatPage> => {
    const res = await getChats({ limit: 6, offset: offset.current });
    if (res.data) {
      offset.current += 6;
      setChats(concatPages(chats || { ...emptyPage }, res.data));
    }
    return res.data;
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchChats();
    };
    initialize();
  }, []);

  return [chats, fetchChats];
};

export default useChats;
