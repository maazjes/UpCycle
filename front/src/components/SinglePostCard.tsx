import { StyleSheet, View, ViewStyle, ScrollView, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Post, TypedImage } from '@shared/types';
import useNotification from 'hooks/useNotification';
import { addFavorite, removeFavorite } from '../services/favorites';
import Carousel from './Carousel';
import Text from './Text';

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 10,
    justifyContent: 'space-between',
    flex: 1
  },
  container: {},
  favorite: {
    marginRight: 10
  },
  dot: {
    height: 5,
    width: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    marginHorizontal: 5
  }
});
interface GridPostProps {
  post: Post;
  containerStyle?: ViewStyle;
}

const SinglePostCard = ({ post, containerStyle = {} }: GridPostProps): JSX.Element => {
  const notification = useNotification();
  const [favoriteId, setFavoriteId] = useState<null | number>(post.favoriteId);

  const onaddFavorite = async (): Promise<void> => {
    try {
      const favorite = await addFavorite({ postId: post.id });
      setFavoriteId(favorite.data.id);
    } catch (e) {
      notification({
        message: 'Adding favorite failed. Please try again.',
        error: true,
        modal: true
      });
    }
  };

  const onremoveFavorite = async (): Promise<void> => {
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId);
        setFavoriteId(null);
      }
    } catch (e) {
      notification({
        message: 'Removing favorite failed. Please try again.',
        error: true,
        modal: true
      });
    }
  };

  const handleFavorite = favoriteId ? onremoveFavorite : onaddFavorite;
  const favoriteIcon = favoriteId ? (
    <AntDesign style={styles.favorite} name="heart" size={28} color="#fa2f3a" />
  ) : (
    <AntDesign style={styles.favorite} name="hearto" size={28} color="#fa2f3a" />
  );

  console.log(`${post.images[0].uri}_400x400?alt=media`);

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Carousel
        images={post.images.map(
          (image): TypedImage => ({ ...image, uri: `${image.uri}_400x400?alt=media` })
        )}
      />
      <View style={styles.infoBox}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ lineHeight: 18 }} weight="bold">
              {post.title}
            </Text>
            <View style={styles.dot} />
            <Text style={{ lineHeight: 18 }}>{post.condition}</Text>
          </View>
          <Text>{post.city}</Text>
          <Text size="subheading" weight="bold" color="green">
            {post.price}
          </Text>
          <Text style={{ marginTop: 5 }}>{post.description}</Text>
        </View>
        <Pressable style={{ marginTop: 4 }} onPress={handleFavorite}>
          {favoriteIcon}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default SinglePostCard;
