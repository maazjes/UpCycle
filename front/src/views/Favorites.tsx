import { useParams } from 'react-router-native';
import { useEffect } from 'react';
import useUsers from '../hooks/useUsers';
import GridView from '../components/GridView';
import Loading from '../components/Loading';

const Favorites = (): JSX.Element => {
  const [users, getUsers] = useUsers();
  console.log(users);
  const { userId } = useParams();
  useEffect((): void => {
    const initializeFavorites = async (): Promise<void> => {
      await getUsers({ userId: Number(userId) });
    };
    initializeFavorites();
  }, []);

  if (!users || !users[0].favorites) {
    return <Loading />;
  }

  return (
    <GridView posts={users[0].favorites} />
  );
};

export default Favorites;
