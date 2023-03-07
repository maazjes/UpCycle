import { FlatList } from 'react-native';
import useChats from 'hooks/useChats';
import { UserStackScreen } from '../types';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';

const Chats = ({ navigation }: UserStackScreen<'StackChat'>): JSX.Element => {
  const { navigate } = navigation;
  const [chats, fetchChats] = useChats();

  if (!chats) {
    return <Loading />;
  }

  return (
    <FlatList
      keyExtractor={(item): string => String(item.id)}
      data={chats.data}
      renderItem={({ item }): JSX.Element => (
        <UserBar
          onPress={(): void => navigate('SingleChat', { userId: item.user.id })}
          user={item.user}
        />
      )}
      onEndReached={fetchChats}
      onEndReachedThreshold={0.2}
    />
  );
};

export default Chats;
