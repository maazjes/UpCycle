import { useEffect } from 'react';
import {
  Text, SafeAreaView
} from 'react-native';
import MasonryList from '../components/MasonryList';
import usePosts from '../hooks/usePosts';
import GridView from '../components/GridView';

const Main = (): JSX.Element => {
  const [posts, getPosts] = usePosts();
  useEffect((): void => {
    getPosts({ page: 0, size: 7 });
  }, []);
  if (!posts) {
    return <Text>loading</Text>;
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#F2F2F2' }}>
      <GridView posts={posts} />
    </SafeAreaView>
  );
};

export default Main;
