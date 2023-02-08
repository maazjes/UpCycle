import {
  FlatList, StyleProp, ViewStyle, View
} from 'react-native';
import PostCard from './PostCard';
import { PostBase } from '../types';

const GridView = ({ posts, style = {} }:
{ posts: PostBase[]; style?: StyleProp<ViewStyle> }): JSX.Element => (
  <FlatList
    columnWrapperStyle={{ justifyContent: 'space-evenly' }}
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
