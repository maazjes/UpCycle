import {
  StyleSheet, FlatList, StyleProp, ViewStyle, Pressable
} from 'react-native';
import { useNavigate } from 'react-router-native';
import GridPost from './GridPost';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  gridPostContainer: {}
});

const GridView = ({ posts, style }:
{ posts: PostBase[]; style: StyleProp<ViewStyle> }): JSX.Element => {
  const navigate = useNavigate();

  return (
    <FlatList
      contentContainerStyle={styles.gridPostContainer}
      columnWrapperStyle={{ justifyContent: 'space-evenly' }}
      numColumns={2}
      keyExtractor={(item): string => String(item.id)}
      data={posts}
      renderItem={({ item }): JSX.Element => (
        <Pressable onPress={(): void => navigate(`/${item.id}`)}>
          <GridPost
            title={item.title}
            price={item.price}
            imageUrl={item.imageUrl}
          />

        </Pressable>
      )}
      style={style}
    />
  );
};

export default GridView;
