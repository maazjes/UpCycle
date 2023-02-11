import { useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import GridView from '../components/GridView';
import Loading from '../components/Loading';
import Text from '../components/Text';
import { UserStackScreen } from '../types';

const Favorites = ({ route }: UserStackScreen<'StackFavorites'>):
JSX.Element => {
  const [users, getUsers] = useUsers();
  const { userId } = route.params;
  useEffect((): void => {
    const initializeFavorites = async (): Promise<void> => {
      await getUsers({ userId });
    };
    initializeFavorites();
  }, []);

  if (!users) {
    return <Loading />;
  }

  if (!users[0]?.favorites) {
    return <Text>no favorites to show</Text>;
  }

  return (
    <GridView posts={users[0].favorites} />
  );
};

export default Favorites;
