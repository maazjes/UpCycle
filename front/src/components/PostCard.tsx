import {
  View, ViewStyle, Image, Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PostBase } from '@shared/types';
import { dpw } from 'util/helpers';
import { UserStackNavigation } from '../types';
import Text from './Text';

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
    <Pressable style={containerStyle} onPress={onPostCardPress}>
      <Image
        style={{
          aspectRatio: 1, width: '100%', height: dpw(0.41), borderRadius: 10
        }}
        source={{ uri: post.images[0]?.uri }}
      />
      <View style={{
        flexDirection: 'column', marginHorizontal: 6, marginTop: 3
      }}
      >
        <Text weight="bold">{post.title}</Text>
        <Text weight="bold">{post.price}</Text>
      </View>
    </Pressable>
  );
};
export default PostCard;
