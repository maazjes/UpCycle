import { StyleSheet, FlatList } from 'react-native';
import GridPost from './GridPost';

const styles = StyleSheet.create({
  gridPostContainer: {}
});

const GridView = () => {
  const posts = [];
  for (let i = 0; i < 10; i += 1) {
    posts.push(<GridPost title="lamppu" price="30€" key={i + 3} />);
  }
  return (
    <FlatList
      contentContainerStyle={styles.gridPostContainer}
      columnWrapperStyle={{ justifyContent: 'space-evenly' }}
      numColumns={2}
      keyExtractor={(item) => item.key}
      data={posts}
      renderItem={({ item }) => item}
    />
  );
};

export default GridView;
