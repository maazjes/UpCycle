import { useRef, useState, useEffect } from 'react';
import { getMessages } from 'services/messages';
import {
  Message, MessagePage, SharedGetMessagesQuery
} from '@shared/types';
import { concatPages } from '../util/helpers';
import { emptyPage } from '../util/constants';

interface PartialMessage extends Omit<Message, 'id' | 'updatedAt' | 'chatId'> {
  id?: number;
  updatedAt?: Date;
  chatId?: number;
}

interface PartialMessagePage extends Omit<MessagePage, 'data'> {
  data: PartialMessage[];
}

const useMessages = (query: SharedGetMessagesQuery):
[PartialMessagePage | null, typeof setMessages, typeof fetchMessages] => {
  const [messagePage, setMessagePage] = useState<PartialMessagePage | null>(null);
  const offset = useRef(0);
  const endReached = useRef(false);

  const fetchMessages = async (): Promise<void> => {
    if (endReached.current) {
      return;
    }
    const res = await getMessages({ ...query, offset: offset.current, limit: 4 });
    if (res.data.data.length > 0) {
      offset.current += res.data.data.length;
      setMessagePage(concatPages(messagePage || { ...emptyPage }, res.data));
    } else {
      endReached.current = true;
    }
  };

  const setMessages = async (message: PartialMessage): Promise<void> => {
    setMessagePage(({
      ...messagePage!,
      totalItems: messagePage!.totalItems + 1,
      offset: messagePage!.offset + 1,
      data: [message, ...messagePage!.data]
    }));
    offset.current += 1;
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchMessages();
    };
    initialize();
  }, []);

  return [messagePage, setMessages, fetchMessages];
};

export default useMessages;
