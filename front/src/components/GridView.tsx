import {
  FlatList, StyleSheet, FlatListProps, View
} from 'react-native';
import { PostBase } from '@shared/types';
import PostCard from './PostCard';
import Container from './Container';

const styles = StyleSheet.create({
  oneItem: {
    justifyContent: 'flex-start'
  },
  moreItems: {
    justifyContent: 'space-between'
  }
});

interface GridViewProps extends Omit<FlatListProps<PostBase>, 'data' | 'renderItem'> {
  posts: PostBase[];
}

const itemSeparator = (): JSX.Element => <View style={{ paddingVertical: 10 }} />;

const GridView = ({ posts, ...props }: GridViewProps): JSX.Element => (
  <Container>
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
      {...props}
    />
  </Container>
);

export default GridView;
