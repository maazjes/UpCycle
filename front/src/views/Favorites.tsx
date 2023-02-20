import { useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import GridView from '../components/GridView';
import Loading from '../components/Loading';
import Text from '../components/Text';
import { useAppSelector } from '../hooks/redux';
import { TokenUser } from '../types';

const Favorites = (): JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const [users, getUsers] = useUsers();
  useEffect((): void => {
    const initializeFavorites = async (): Promise<void> => {
      if (currentUser) {
        await getUsers({ userId: currentUser.id });
      }
    };
    initializeFavorites();
  }, []);

  if (!users) {
    return <Loading />;
  }

  if (!users[0]?.favorites || users[0].favorites?.length === 0) {
    return <Text>no favorites to show</Text>;
  }

  return (
    <GridView posts={users[0].favorites} />
  );
};

export default Favorites;
