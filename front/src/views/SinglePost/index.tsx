import {
  StyleSheet, Dimensions, ScrollView
} from 'react-native';
import { useState, useEffect } from 'react';
import Loading from '../../components/Loading';
import UserBar from '../../components/UserBar';
import SinglePostCard from '../../components/SinglePostCard';
import { Post, TokenUser, UserStackScreen } from '../../types';
import { useAppSelector } from '../../hooks/redux';
import PostOptions from './PostOptions';
import Button from '../../components/Button';
import postsService from '../../services/posts';

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

const SinglePost = ({ route, navigation }:
UserStackScreen<'SinglePost'>): JSX.Element => {
  const { postId } = route.params;
  const [post, setPost] = useState<null | Post>(null);
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const { navigate } = navigation;

  useEffect((): void => {
    const getAndSetPost = async (): Promise<void> => {
      const res = await postsService.getPost({ postId });
      setPost(res.data);
    };
    getAndSetPost();
  }, []);

  if (!post) {
    return <Loading />;
  }

  const onUserBarPress = (): void => {
    navigate('StackProfile', { userId: post.user.id, username: post.user.username });
  };

  const onMessage = (): void => {
    navigate('SingleChat', { userId: post.user.id });
  };

  const itemRight = currentUser?.id === post.user.id
    ? <PostOptions post={post} />
    : <Button onSubmit={onMessage} style={{ paddingHorizontal: 10, height: 32 }} text="Message" />;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      <UserBar onPress={onUserBarPress} user={post.user} itemRight={itemRight} />
      <SinglePostCard
        post={post}
        containerStyle={styles.container}
      />
    </ScrollView>
  );
};

export default SinglePost;
