import { View, Text, StyleSheet } from 'react-native';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    rowGap: 10
  },
  text: {
    marginRight: 20,
    marginLeft: 20
  }
});

const PostRow = ({ post }: { post: PostBase }): JSX.Element => (
  <View style={styles.container}>
    <Text style={styles.text}>{post.title}</Text>
    <Text style={styles.text}>{post.price}</Text>
  </View>
);

export default PostRow;
