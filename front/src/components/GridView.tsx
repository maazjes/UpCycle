import { PostBase } from '@shared/types';
import { FlatList, FlatListProps, StyleSheet } from 'react-native';
import { dpw } from 'util/helpers';
import PostCard from './PostCard';

const styles = StyleSheet.create({
  posts: {
    justifyContent: 'space-between',
    paddingHorizontal: dpw(0.033),
    paddingBottom: dpw(0.033)
  }
});

interface GridViewProps
  extends Omit<FlatListProps<PostBase>, 'data' | 'keyExtractor' | 'renderItem'> {
  posts: PostBase[];
}

const GridView = ({ posts, columnWrapperStyle, ...props }: GridViewProps): JSX.Element => (
  <FlatList
    {...props}
    columnWrapperStyle={[styles.posts, columnWrapperStyle]}
    data={posts}
    keyExtractor={({ id }): string => String(id)}
    numColumns={2}
    renderItem={({ item }): JSX.Element => <PostCard post={item} />}
  />
);

export default GridView;
