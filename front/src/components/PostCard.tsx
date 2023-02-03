import {
  StyleSheet, View, ImageStyle, ViewStyle, Image, Pressable
} from 'react-native';
import { useNavigate } from 'react-router-native';
import Text from './Text';
import ProfileImage from './ProfileImage';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  titleAndPrice: {
    flexDirection: 'column'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 5,
    justifyContent: 'space-between'
  },
  container: {
    padding: 10,
    backgroundColor: '#FFFF'
  }
});

interface GridPostProps {
  post: PostBase;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}

const PostCard = ({
  post, imageStyle = {}, containerStyle = {}
}: GridPostProps): JSX.Element => {
  const navigate = useNavigate();
  const onPostCardPress = (): void => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <Pressable onPress={onPostCardPress}>
      <View style={[styles.container, containerStyle]}>
        <Image
          style={imageStyle}
          source={{ uri: post.images[0].url }}
        />
        <View style={styles.infoBox}>
          <View style={styles.titleAndPrice}>
            <Text>{post.title}</Text>
            <Text fontWeight="bold" color="blue">{post.price}</Text>
          </View>
          <ProfileImage userId={post.user.id} />
        </View>
      </View>
    </Pressable>
  );
};
export default PostCard;
