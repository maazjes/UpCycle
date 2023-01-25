import { Text, StyleSheet } from 'react-native';
import { useParams } from 'react-router-native';
import { useEffect, useState } from 'react';
import postsService from '../services/posts';
import { PostBase } from '../types';
import GridPost from '../components/GridPost';

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250
  },
  container: {
    justifyContent: 'center'
  }
});

const SinglePost = (): JSX.Element => {
  const [post, setPost] = useState<null | PostBase>(null);
  const { postId } = useParams();
  useEffect((): void => {
    const getPost = async (): Promise<void> => {
      if (!postId) {
        return;
      }
      const response = await postsService.getPostById(postId);
      if (response.data) {
        setPost(response.data);
      }
    };
    getPost();
  }, []);
  if (!post) {
    return <Text>loading</Text>;
  }
  return (
    <GridPost
      title={post.title}
      price={post.price}
      imageUrl={post.imageUrl}
      description={post.description}
      imageStyle={styles.image}
      containerStyle={styles.container}
    />
  );
};

export default SinglePost;
