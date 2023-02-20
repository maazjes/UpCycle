import {
  FlatList, StyleProp, ViewStyle, StyleSheet
} from 'react-native';
import PostCard from './PostCard';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  oneItem: {
    justifyContent: 'flex-start'
  },
  moreItems: {
    justifyContent: 'space-evenly'
  }
});

const GridView = ({ posts, style = {} }:
{ posts: PostBase[]; style?: StyleProp<ViewStyle> }): JSX.Element => (
  <FlatList
    columnWrapperStyle={[styles.moreItems, posts.length === 1 && styles.oneItem]}
    numColumns={2}
    keyExtractor={(item): string => String(item.id)}
    data={posts}
    renderItem={({ item }): JSX.Element => (
      <PostCard
        post={item}
      />
    )}
    style={style}
  />
);

export default GridView;
