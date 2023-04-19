import { StyleSheet, View, ViewStyle, ScrollView, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Post, TypedImage } from '@shared/types';
import { useAppDispatch } from 'hooks/redux';
import { addFavorite, removeFavorite } from 'reducers/favorites';
import { dpw } from 'util/helpers';
import { editSinglePost, setSinglePost } from 'reducers/singlePost';
import { createFavorite, deleteFavorite } from '../services/favorites';
import Carousel from './Carousel';
import Text from './Text';

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    padding: dpw(0.04),
    justifyContent: 'space-between',
    flex: 1
  },
  favorite: {
    position: 'absolute',
    right: 0
  },
  dot: {
    height: dpw(0.013),
    width: dpw(0.013),
    backgroundColor: 'black',
    borderRadius: 3,
    marginHorizontal: dpw(0.025)
  }
});
interface GridPostProps {
  post: Post;
  containerStyle?: ViewStyle;
}

const SinglePostCard = ({ post, containerStyle = {} }: GridPostProps): JSX.Element => {
  const [favoriteId, setFavoriteId] = useState<null | number>(post.favoriteId);
  const dispatch = useAppDispatch();

  const onAddFavorite = async (): Promise<void> => {
    try {
      const favorite = await createFavorite({ postId: post.id });
      const newPost = { ...post, favoriteId: favorite.data.id };
      dispatch(addFavorite(newPost));
      dispatch(setSinglePost(newPost));
      setFavoriteId(favorite.data.id);
    } catch {}
  };

  const onDeleteFavorite = async (): Promise<void> => {
    if (favoriteId) {
      try {
        await deleteFavorite(favoriteId);
        const newPost = { ...post, favoriteId: null };
        dispatch(removeFavorite(post.id));
        dispatch(editSinglePost(newPost));
        setFavoriteId(null);
      } catch {}
    }
  };

  const handleFavorite = favoriteId ? onDeleteFavorite : onAddFavorite;

  const favoriteIcon = favoriteId ? (
    <AntDesign style={styles.favorite} name="heart" size={dpw(0.085)} color="#fa2f3a" />
  ) : (
    <AntDesign style={styles.favorite} name="hearto" size={dpw(0.085)} color="#fa2f3a" />
  );

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Carousel
        images={post.images
          .map((image): TypedImage => ({ ...image, uri: `${image.uri}_400x400?alt=media` }))
          .reverse()}
      />
      <View style={styles.infoBox}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text weight="bold">{post.title}</Text>
            <View style={styles.dot} />
            <Text style={{ alignSelf: 'flex-start', textAlignVertical: 'top', lineHeight: 0 }}>
              {post.condition}
            </Text>
          </View>
          <Text>{post.city}</Text>
          <Text size="subheading" weight="bold" color="green">
            {post.price}
          </Text>
          <Text style={{ marginTop: dpw(0.018) }}>{post.description}</Text>
        </View>
        <Pressable onPress={handleFavorite}>{favoriteIcon}</Pressable>
      </View>
    </ScrollView>
  );
};

export default SinglePostCard;
