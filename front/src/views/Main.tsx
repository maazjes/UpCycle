import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import postsService from '../services/posts';
import GridView from '../components/GridView';
import { PostBase } from '../types';

const Main = (): JSX.Element => {
  const [posts, setPosts] = useState<PostBase[] | null>(null);
  useEffect((): void => {
    const getResponse = async (): Promise<void> => {
      const postsResponse = await postsService.getPosts(0, 5);
      setPosts(postsResponse.data.posts);
    };
    getResponse();
  }, []);
  if (!posts) {
    return <Text>loading</Text>;
  }
  return (
    <GridView posts={posts} />
  );
};

export default Main;
