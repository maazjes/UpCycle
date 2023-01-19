import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import postsService from '../services/posts';
import GridView from '../components/GridView';

const Main = (): JSX.Element => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getResponse = async () => {
      const postsResponse = await postsService.getPosts(0, 5);
      setPosts(postsResponse.data.posts);
    };
    getResponse();
  }, []);
  return <GridView posts={posts} />;
};

export default Main;
