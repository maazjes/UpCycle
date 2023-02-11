import { View, StyleSheet, Dimensions } from 'react-native';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import usePosts from '../hooks/usePosts';
import UserBar from '../components/UserBar';
import SinglePostCard from '../components/SinglePostCard';
import { UserStackScreen } from '../types';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  image: {
    width: screenWidth,
    height: screenWidth
  },
  container: {
    justifyContent: 'center'
  }
});

const SinglePost = ({ route }:
UserStackScreen<'StackSinglePost'>): JSX.Element => {
  const { postId } = route.params;
  const [posts, getPosts] = usePosts();
  useEffect((): void => {
    if (postId) {
      getPosts({ postId });
    }
  }, []);
  if (!posts || !posts[0]) {
    return <Loading />;
  }
  const post = posts[0];
  return (
    <View>
      <UserBar user={post.user} />
      <SinglePostCard
        post={post}
        imageStyle={styles.image}
        containerStyle={styles.container}
      />
    </View>
  );
};

export default SinglePost;
