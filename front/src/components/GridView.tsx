import { StyleSheet } from 'react-native';
import GridPost from './GridPost';
import { FlatList } from 'react-native';

const styles = StyleSheet.create({
  gridPostContainer: {}
});

const GridView = () => {
  const posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push(<GridPost title={'lamppu'} price={'30€'} imageSrc={'../../assets/icon.png'} key={i + 3} />);
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
