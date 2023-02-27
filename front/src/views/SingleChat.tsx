import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Message, TokenUser, UserStackScreen } from '../types';
import TextInput from '../components/TextInput';
import socket from '../util/socket';
import messagesService from '../services/messages';
import { useAppSelector } from '../hooks/redux';
import Text from '../components/Text';
import Button from '../components/Button';

type VisibleMessage = Omit<Message, 'id' | 'chatId'>;

const styles = StyleSheet.create({
  message: {
    padding: 8,
    backgroundColor: '#9BFF66',
    borderRadius: 15,
    margin: 5
  }
});

const SingleChat = ({ route }: UserStackScreen<'SingleChat'>): JSX.Element => {
  const [chatId, setChatId] = useState<number>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<VisibleMessage[]>([]);
  const { userId } = route.params;
  const currentUser = useAppSelector((state): TokenUser | null => state.user);

  useEffect((): void => {
    socket.on('message', (data): void => {
      setMessages(messages.concat({ ...data, senderId: userId, receiverId: currentUser.id }));
    });
  }, [chatId]);

  useEffect((): void => {
    const getAndSetMessages = async (): Promise<void> => {
      if (!currentUser) {
        return;
      }
      try {
        const response = await messagesService.getMessages({
          userId1: currentUser.id, userId2: userId, page: 0, size: 5
        });
        setMessages(response.data.messages);
      } catch (e) {
        console.log(e);
      }
    };
    getAndSetMessages();
  }, []);

  useEffect((): void => {
    if (chatId) {
      socket.emit('join', chatId);
    }
  }, [chatId]);

  const onNewMessage = async (): Promise<void> => {
    const { data: newMessage } = await messagesService.createMessage(
      { content: message, receiverId: userId }
    );
    socket.emit('message', { content: message, chatId: newMessage.chatId, createdAt: newMessage.createdAt });
    if (!chatId) {
      setChatId(newMessage.chatId);
    }
    setMessages(messages.concat(newMessage));
  };

  return (
    <View style={{
      flexDirection: 'column', margin: 20, justifyContent: 'space-between', flex: 1
    }}
    >
      <View>
        {messages.map((msg): JSX.Element => (
          <View
            key={msg.createdAt}
            style={[msg.senderId === currentUser?.id
              ? { alignSelf: 'flex-start' }
              : { alignSelf: 'flex-end' }, styles.message]}
          >
            <Text>
              {msg.content}
            </Text>
          </View>
        ))}
      </View>
      <View style={{
        flexDirection: 'row', marginTop: 10, marginBottom: 20
      }}
      >
        <TextInput style={{ marginRight: 5, flex: 1 }} onChangeText={(value): void => setMessage(value)} error={false} />
        <Button style={{ paddingHorizontal: 15, flex: 1 }} onSubmit={onNewMessage} element={<Feather name="message-circle" size={28} color="white" />} />
      </View>
    </View>
  );
};

export default SingleChat;
