import { useParams } from 'react-router-native';
import { useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import GridView from '../components/GridView';
import Loading from '../components/Loading';
import Text from '../components/Text';

const Favorites = (): JSX.Element => {
  const [users, getUsers] = useUsers();
  console.log(users);
  const { userId } = useParams();
  console.log(userId);
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
