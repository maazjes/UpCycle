import useUsers from 'src/hooks/useUsers';
import { useEffect } from 'react';
import Loading from 'src/components/Loading';
import UserBar from 'src/components/UserBar';
import { View } from 'react-native';

const Follows = ({ role }: { role: 'follower' | 'followed' }): JSX.Element => {
  const [users, fetchMore] = useUsers();

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      await fetchMore({ role });
    };
    initialize();
  }, []);

  if (!users) {
    return <Loading />;
  }

  const onPress = ? role === 'follower'

  return (
    <View>
      {users.map(
        (user): JSX.Element => <UserBar itemRight user={user} />
      )}
    </View>
  );
};

export default Follows;
