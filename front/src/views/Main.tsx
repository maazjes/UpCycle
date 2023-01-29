import { useEffect } from 'react';
import { Text } from 'react-native';
import usePosts from '../hooks/usePosts';
import MasonryList from '../components/MasonryList';

const Main = (): JSX.Element => {
  const [posts, getPosts] = usePosts({ page: 0, size: 7 });
  useEffect((): void => {
    getPosts();
  }, []);
  if (!posts) {
    return <Text>loading</Text>;
  }
  return (
    <Text>asd</Text>
  );
};

export default Main;
