import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { TokenUser, Chat, UserStackScreen } from '../types';
import chatsService from '../services/chats';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';

const Chats = ({ navigation }: UserStackScreen<'StackChat'>): JSX.Element => {
  const { navigate } = navigation;
  const [chats, setChats] = useState<null | Chat[]>(null);
  const currentUser = useAppSelector((state): TokenUser | null => state.user);

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      if (currentUser) {
        const response = await chatsService.getChats({ userId: currentUser.id });
        setChats(response.data);
      }
    };
    initialize();
  }, []);

  if (!chats || !currentUser) {
    return <Loading />;
  }

  return (
    <View>
      {chats.map((chat): JSX.Element => {
        const user = currentUser.id === chat.creator.id
          ? chat.user : chat.creator;
        return (
          <UserBar
            key={chat.id}
            onPress={(): void => navigate('SingleChat', { userId: user.id })}
            user={user}
          />
        );
      })}
    </View>
  );
};

export default Chats;
