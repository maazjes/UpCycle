import { View, ViewStyle, Image, Pressable, ImageStyle, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostBase } from '@shared/types';
import { dpw } from 'util/helpers';
import { UserStackNavigation } from '../types';
import Text from './Text';

interface GridPostProps {
  post: PostBase;
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle | ImageStyle[];
}

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    width: '100%',
    height: dpw(0.45),
    borderRadius: dpw(0.03)
  },
  info: {
    flexDirection: 'column',
    marginHorizontal: dpw(0.01),
    marginTop: dpw(0.01),
    flexWrap: 'wrap',
    width: dpw(0.45)
  }
});

const PostCard = ({ post, imageStyle = {}, containerStyle = {} }: GridPostProps): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  const onPostCardPress = (): void => {
    navigate('SinglePost', { postId: post.id });
  };

  return (
    <Pressable style={containerStyle} onPress={onPostCardPress}>
      <Image
        style={[styles.image, imageStyle]}
        source={{ uri: `${post.images[0].uri.split('?')[0]}_200x200?alt=media` }}
      />
      <View style={styles.info}>
        <Text style={{ maxWidth: dpw(0.45) }}>{post.title}</Text>
        <Text>{post.price}</Text>
      </View>
    </Pressable>
  );
};
export default PostCard;
