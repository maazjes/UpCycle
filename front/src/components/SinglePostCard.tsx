import {
  StyleSheet, View, ViewStyle, ScrollView,
  Pressable
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { addFavorite, removeFavorite } from '../services/favorites';
import Carousel from './Carousel';
import Text from './Text';
import useError from '../hooks/useError';
import { Post } from '../types';

const styles = StyleSheet.create({
  titleAndPrice: {
    flexDirection: 'column'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    justifyContent: 'space-between'
  },
  container: {
  },
  favorite: {
    marginRight: 10
  }
});
interface GridPostProps {
  post: Post;
  containerStyle?: ViewStyle;
}

const SinglePostCard = ({
  post, containerStyle = {}
}: GridPostProps): JSX.Element => {
  const error = useError();
  const [favoriteId, setFavoriteId] = useState<null | number>(post.favoriteId);

  const onaddFavorite = async (): Promise<void> => {
    try {
      const favorite = await addFavorite(post.id);
      setFavoriteId(favorite.data.id);
    } catch (e) {
      error(e);
    }
  };

  const onremoveFavorite = async (): Promise<void> => {
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId);
        setFavoriteId(null);
      }
    } catch (e) {
      error(e);
    }
  };

  const handleFavorite = favoriteId ? onremoveFavorite : onaddFavorite;
  const favoriteIcon = favoriteId
    ? <AntDesign style={styles.favorite} name="heart" size={28} color="#fa2f3a" />
    : <AntDesign style={styles.favorite} name="hearto" size={28} color="#fa2f3a" />;

  return (
    <ScrollView contentContainerStyle={containerStyle}>
      <Carousel
        images={post.images}
      />
      <View style={styles.infoBox}>
        <View style={styles.titleAndPrice}>
          <Text fontWeight="bold" fontSize="subheading">{post.title}</Text>
          <Text fontSize="subheading" fontWeight="bold" color="green">{post.price}</Text>
          <Text style={{ marginTop: 5 }}>{post.description}</Text>
        </View>
        <Pressable onPress={handleFavorite}>
          {favoriteIcon}
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default SinglePostCard;
