import {
  StyleSheet, View, ViewStyle, Image, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostBase, UserStackNavigation } from '../types';
import Text from './Text';

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
    margin: 10
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
    <Pressable style={[styles.container, containerStyle]} onPress={onPostCardPress}>
      <Image
        style={{
          aspectRatio: 1, width: '100%', height: 200, borderRadius: 10
        }}
        source={{ uri: post.images[0]?.uri }}
      />
      <View style={{
        flexDirection: 'column', marginHorizontal: 6, marginTop: 3
      }}
      >
        <Text fontWeight="bold">{post.title}</Text>
        <Text fontWeight="bold">{post.price}</Text>
      </View>
    </Pressable>
  );
};
export default PostCard;
