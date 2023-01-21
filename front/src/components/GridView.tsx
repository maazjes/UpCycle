import { StyleSheet, FlatList } from 'react-native';
import GridPost from './GridPost';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  gridPostContainer: {}
});

const GridView = ({ posts }: { posts: PostBase[] }): JSX.Element => (
  <FlatList
    contentContainerStyle={styles.gridPostContainer}
    columnWrapperStyle={{ justifyContent: 'space-evenly' }}
    numColumns={2}
    keyExtractor={(item): string => String(item.id)}
    data={posts}
    renderItem={({ item }): JSX.Element => (
      <GridPost
        title={item.title}
        price={item.price}
        imageUrl={item.imageUrl}
      />
    )}
  />
);

export default GridView;
