import { StyleSheet, FlatList } from 'react-native';
import GridPost from './GridPost';

const styles = StyleSheet.create({
  gridPostContainer: {}
});

const GridView = ({ posts }): JSX.Element => (
  <FlatList
    contentContainerStyle={styles.gridPostContainer}
    columnWrapperStyle={{ justifyContent: 'space-evenly' }}
    numColumns={2}
    keyExtractor={(item) => item.key}
    data={posts}
    renderItem={({ item }): JSX.Element => <GridPost title={item.title} price={item.price} imageUrl={item.imageUrl} />}
  />
);

export default GridView;
