import {
  StyleSheet, View, ViewStyle, Image, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostBase, UserStackNavigation } from '../types';

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
  const { navigate } = useNavigation<UserStackNavigation>();
  const onPostCardPress = (): void => {
    navigate('SinglePost', { postId: post.id });
  };

  return (
    <Pressable onPress={onPostCardPress}>
      <View style={[styles.container, containerStyle]}>
        <Image
          style={{ aspectRatio: 1, width: '100%', height: 200 }}
          source={{ uri: post.images[0]?.uri }}
        />
      </View>
    </Pressable>
  );
};
export default PostCard;
