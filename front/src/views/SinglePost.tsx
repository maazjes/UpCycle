import { View, StyleSheet, Dimensions } from 'react-native';
import { useParams } from 'react-router-native';
import Text from '../components/Text';
import GridPost from '../components/GridPost';
import usePost from '../hooks/usePost';
import UserBar from '../components/UserBar';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  userBar: {
    padding: 10
  },
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
  const post = usePost(Number(postId));
  if (!post) {
    return <Text>loading</Text>;
  }
  return (
    <View>
      <UserBar style={styles.userBar} userId={post.user.id} username={post.user.username} />
      <GridPost
        post={post}
        imageStyle={styles.image}
        containerStyle={styles.container}
      />
    </View>
  );
};

export default SinglePost;
