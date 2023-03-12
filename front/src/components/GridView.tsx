import {
  FlatList, StyleSheet, FlatListProps, View
} from 'react-native';
import { PostBase } from '@shared/types';
import PostCard from './PostCard';

const styles = StyleSheet.create({
  oneItem: {
    justifyContent: 'flex-start'
  },
  moreItems: {
    justifyContent: 'space-evenly'
  }
});

interface GridViewProps extends Omit<FlatListProps<PostBase>, 'data' | 'renderItem'> {
  posts: PostBase[];
}

const itemSeparator = (): JSX.Element => <View style={{ paddingVertical: 10 }} />;

const GridView = ({ posts, ...props }: GridViewProps): JSX.Element => (
  <FlatList
    columnWrapperStyle={[styles.moreItems, posts.length === 1 && styles.oneItem]}
    numColumns={2}
    keyExtractor={(item): string => String(item.id)}
    data={posts}
    ItemSeparatorComponent={itemSeparator}
    renderItem={({ item }): JSX.Element => (
      <PostCard
        post={item}
      />
    )}
    showsVerticalScrollIndicator={false}
    {...props}
  />
);

export default GridView;
