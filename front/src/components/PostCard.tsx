import {
  StyleSheet, View, ViewStyle, Image, Pressable
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
    paddingVertical: 10,
    justifyContent: 'space-between'
  },
  container: {
    backgroundColor: '#FFFF',
    margin: 5
  }
});

interface GridPostProps {
  post: PostBase;
  containerStyle?: ViewStyle;
}

const PostCard = ({
  post, containerStyle = {}
}: GridPostProps): JSX.Element => {
  const navigate = useNavigate();
  const onPostCardPress = (): void => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <Pressable onPress={onPostCardPress}>
      <View style={[styles.container, containerStyle]}>
        <Image
          style={{ aspectRatio: 1, width: '100%', height: 200 }}
          source={{ uri: post.images[0]?.uri }}
        />
        <View style={styles.infoBox}>
          <View style={styles.titleAndPrice}>
            <Text>{post.title}</Text>
            <Text fontWeight="bold" color="blue">{post.price}</Text>
          </View>
          <ProfileImage
            size={30}
            uri={post.user.photoUrl}
            userId={post.user.id}
          />
        </View>
      </View>
    </Pressable>
  );
};
export default PostCard;
