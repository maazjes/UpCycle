import { useEffect } from 'react';
import {
  Text, SafeAreaView
} from 'react-native';
import MasonryList from '../components/MasonryList';
import usePosts from '../hooks/usePosts';

const Main = (): JSX.Element => {
  const [posts, getPosts] = usePosts({ page: 0, size: 7 });
  useEffect((): void => {
    getPosts();
  }, []);
  if (!posts) {
    return <Text>loading</Text>;
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#F2F2F2' }}>
      <MasonryList posts={posts} />
    </SafeAreaView>
  );
};

export default Main;
