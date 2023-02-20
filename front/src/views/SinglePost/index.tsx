import {
  StyleSheet, Dimensions, ScrollView
} from 'react-native';
import { useEffect } from 'react';
import Loading from '../../components/Loading';
import usePosts from '../../hooks/usePosts';
import UserBar from '../../components/UserBar';
import SinglePostCard from '../../components/SinglePostCard';
import { TokenUser, UserStackScreen } from '../../types';
import { useAppSelector } from '../../hooks/redux';
import PostOptions from './PostOptions';
import Button from '../../components/Button';

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
UserStackScreen<'SinglePost'>): JSX.Element => {
  const { postId } = route.params;
  const [posts, getPosts] = usePosts();
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  useEffect((): void => {
    if (postId) {
      getPosts({ postId });
    }
  }, []);
  if (!posts || !posts[0]) {
    return <Loading />;
  }
  const post = posts[0];
  const itemRight = currentUser?.id === post.user.id
    ? <PostOptions post={post} />
    : <Button handleSubmit={(): null => null} style={{ paddingHorizontal: 10, height: 32 }} text="Message" />;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      <UserBar user={post.user} itemRight={itemRight} />
      <SinglePostCard
        post={post}
        containerStyle={styles.container}
      />
    </ScrollView>
  );
};

export default SinglePost;
