import { View, StyleSheet, Dimensions } from 'react-native';
import { useParams } from 'react-router-native';
import { useEffect } from 'react';
import Loading from '../components/Loading';
import usePosts from '../hooks/usePosts';
import UserBar from '../components/UserBar';
import SinglePostCard from '../components/SinglePostCard';

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

const SinglePost = (): JSX.Element => {
  const { postId } = useParams();
  const [posts, getPosts] = usePosts();
  useEffect((): void => {
    if (postId) {
      getPosts({ postId: Number(postId) });
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
