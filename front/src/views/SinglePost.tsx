import { View, StyleSheet, Dimensions } from 'react-native';
import { useParams } from 'react-router-native';
import { useEffect } from 'react';
import Text from '../components/Text';
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
    getPosts();
  }, []);
  if (!posts) {
    return <Text>loading</Text>;
  }
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
