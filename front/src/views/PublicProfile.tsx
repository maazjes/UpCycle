import * as React from 'react';
import { useEffect } from 'react';
import {
  View, StyleSheet
} from 'react-native';
import Loading from '../components/Loading';
import Text from '../components/Text';
import usePosts from '../hooks/usePosts';
import UserBar from '../components/UserBar';
import GridView from '../components/GridView';
import { UserStackScreen } from '../types';

const styles = StyleSheet.create({
  container: {
  }
});

const PublicProfile = ({ route }:
UserStackScreen<'PublicProfile'>):
JSX.Element => {
  const { userId } = route.params;
  const [posts, getPosts] = usePosts();

  useEffect((): void => {
    getPosts({ userId });
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
