import { PostBase } from '@shared/types';
import { StyleSheet, View, ViewProps } from 'react-native';
import PostCard from './PostCard';

const styles = StyleSheet.create({
  posts: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  onePost: {
    justifyContent: 'flex-start'
  },
  postCard: {
    marginBottom: 20
  },
  lastPostCard: {
    marginBottom: 10
  }
});

interface Props extends ViewProps {
  posts: PostBase[];
}

const GridView = ({ posts, style }: Props): JSX.Element => (
  <View style={[styles.posts, posts.length === 1 ? styles.onePost : {}, style]}>
    {posts.map((post, i): JSX.Element => (
      <PostCard
        key={post.id}
        containerStyle={i < posts.length - 2 ? styles.postCard : styles.lastPostCard}
        post={post}
      />
    ))}
  </View>
);

export default GridView;
