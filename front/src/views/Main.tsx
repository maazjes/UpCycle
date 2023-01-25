import { useEffect } from 'react';
import { Text } from 'react-native';
import GridView from '../components/GridView';
import usePosts from '../hooks/usePosts';

const Main = (): JSX.Element => {
  const [posts, getPosts] = usePosts({ page: 0, size: 5 });
  useEffect((): void => {
    getPosts();
  }, []);
  if (!posts) {
    return <Text>loading</Text>;
  }
  return (
    <GridView style={{ marginTop: 30 }} posts={posts} />
  );
};

export default Main;
