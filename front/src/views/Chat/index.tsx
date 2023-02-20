import { useEffect, useState } from 'react';
import { View } from 'react-native';
import socket from '../../util/socket';
import Button from '../../components/Button';
import { useAppSelector } from '../../hooks/redux';
import { TokenUser } from '../../types';
import TextInput from '../../components/TextInput';

const Chat = (): JSX.Element => {
  const [message, setMessage] = useState('');
  const currentUser = useAppSelector((state): TokenUser | null => state.user);

  useEffect((): void => {
    if (currentUser) { socket.auth = { userId: currentUser.id }; }
    socket.connect();
  }, []);

  const handleSubmit = (): void => {
    socket.emit('message', { receiverId: 'addwd', content: message });
  };

  return (
    <View>
      <TextInput error={false} onChangeText={(text): void => setMessage(text)} />
      <Button handleSubmit={handleSubmit} text="send" />
    </View>
  );
};

export default Chat;
