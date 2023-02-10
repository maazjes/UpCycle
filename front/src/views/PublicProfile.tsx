import * as React from 'react';
import { useEffect } from 'react';
import {
  View, StyleSheet
} from 'react-native';
import { useParams } from 'react-router-native';
import Loading from '../components/Loading';
import Text from '../components/Text';
import usePosts from '../hooks/usePosts';
import UserBar from '../components/UserBar';
import GridView from '../components/GridView';

const styles = StyleSheet.create({
  container: {
  }
});

const PublicProfile = (): JSX.Element => {
  const { userId } = useParams();
  const [posts, getPosts] = usePosts();

  useEffect((): void => {
    getPosts({ userId: Number(userId) });
  }, []);

  if (!posts) {
    return <Loading />;
  }
  if (posts.length === 0) {
    return <Text>no posts to show</Text>;
  }

  return (
    <View style={styles.container}>
      <UserBar user={posts[0].user} />
      <GridView posts={posts} />
    </View>
  );
};

export default PublicProfile;
