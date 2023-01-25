import { View, Text, StyleSheet } from 'react-native';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
});

const PostRow = ({ post }: { post: PostBase }): JSX.Element => (
  <View style={styles.container}>
    <Text>{post.title}</Text>
    <Text>{post.price}</Text>
  </View>
);

export default PostRow;
