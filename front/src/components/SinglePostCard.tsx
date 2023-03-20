import {
  StyleSheet, View, ViewStyle, ScrollView,
  Pressable
} from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { Post } from '@shared/types';
import useNotification from 'hooks/useNotification';

// @ts-ignore
import * as postcodes from 'datasets-fi-postalcodes';
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
  const notification = useNotification();
  const [favoriteId, setFavoriteId] = useState<null | number>(post.favoriteId);

  const onaddFavorite = async (): Promise<void> => {
    try {
      const favorite = await addFavorite({ postId: post.id });
      setFavoriteId(favorite.data.id);
    } catch (e) {
      notification({ message: 'Adding favorite failed. Please try again.', error: true, modal: true });
    }
  };

  const onremoveFavorite = async (): Promise<void> => {
    try {
      if (favoriteId) {
        await removeFavorite(favoriteId);
        setFavoriteId(null);
      }
    } catch (e) {
      notification({ message: 'Removing favorite failed. Please try again.', error: true, modal: true });
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
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text size="subheading" weight="bold">{post.title}</Text>
            <Entypo name="dot-single" size={20} color="black" />
            <Text>{post.condition}</Text>
          </View>
          <Text>{postcodes[post.postcode]}</Text>
          <Text size="subheading" weight="bold" color="green">{post.price}</Text>
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
