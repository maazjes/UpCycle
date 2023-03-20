import { FlatList } from 'react-native';
import useChats from 'hooks/useChats';
import Container from 'components/Container';
import Text from 'components/Text';
import { dph, formatDate } from 'util/helpers';
import Line from 'components/Line';
import { UserStackScreen } from '../types';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';

const ItemSeparator = (): JSX.Element => <Line style={{ marginVertical: 11 }} />;

const Chats = ({ navigation }: UserStackScreen<'StackChat'>): JSX.Element => {
  const { navigate } = navigation;
  const [chats, fetchChats] = useChats();

  if (!chats) {
    return <Loading />;
  }

  return (
    <Container>
      <FlatList
        keyExtractor={(item): string => String(item.id)}
        data={chats.data}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }): JSX.Element => (
          <UserBar
            displayNameStyle={{ marginBottom: dph(0.007), fontWeight: 'bold' }}
            profilePhotoSize={50}
            onPress={(): void => navigate('SingleChat', { userId: item.user.id })}
            user={item.user}
            extra={<Text>{item.lastMessage.text}</Text>}
            textRight={formatDate(item.lastMessage.createdAt)}
          />
        )}
        onEndReached={fetchChats}
        onEndReachedThreshold={0.2}
      />
    </Container>
  );
};

export default Chats;
