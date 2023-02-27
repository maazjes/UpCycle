import { useEffect } from 'react';
import usePosts from '../hooks/usePosts';
import GridView from '../components/GridView';
import Loading from '../components/Loading';
import Text from '../components/Text';
import { useAppSelector } from '../hooks/redux';
import { TokenUser } from '../types';

const Favorites = (): JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const [posts, getPosts] = usePosts();
  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      if (currentUser) {
        await getPosts({ favorite: true });
      }
    };
    initialize();
  }, []);

  if (!posts) {
    return <Loading />;
  }

  if (posts.length === 0) {
    return <Text>no posts to show</Text>;
  }

  return (
    <GridView posts={posts} />
  );
};

export default Favorites;
