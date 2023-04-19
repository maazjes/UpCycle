import { useState, useEffect } from 'react';
import { getMessages } from 'services/messages';
import { Message, MessagePage, SharedGetMessagesQuery } from '@shared/types';
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

const useMessages = (
  query: SharedGetMessagesQuery
): [PartialMessagePage | null, typeof addMessage, typeof fetchMessages] => {
  const [messagePage, setMessagePage] = useState<PartialMessagePage | null>(null);

  const fetchMessages = async (): Promise<void> => {
    const res = await getMessages({ ...query, offset: messagePage?.offset || 0, limit: 4 });
    setMessagePage(concatPages(messagePage || { ...emptyPage }, res.data));
  };

  const addMessage = async (message: PartialMessage): Promise<void> => {
    if (messagePage) {
      setMessagePage({
        ...messagePage,
        totalItems: messagePage.totalItems + 1,
        offset: messagePage.offset + 1,
        data: [message, ...messagePage.data]
      });
    }
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchMessages();
    };
    initialize();
  }, []);

  return [messagePage, addMessage, fetchMessages];
};

export default useMessages;
