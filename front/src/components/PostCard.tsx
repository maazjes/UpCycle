import { View, ViewStyle, Image, Pressable, ImageStyle } from 'react-native';
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

const PostCard = ({ post, imageStyle = {}, containerStyle = {} }: GridPostProps): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  const onPostCardPress = (): void => {
    navigate('SinglePost', { postId: post.id });
  };

  console.log(post);

  return (
    <Pressable style={containerStyle} onPress={onPostCardPress}>
      <Image
        style={[
          {
            aspectRatio: 1,
            width: '100%',
            height: dpw(0.45),
            borderRadius: 10
          },
          imageStyle
        ]}
        source={{ uri: `${post.images[0].uri.split('?')[0]}_200x200?alt=media` }}
      />
      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 6,
          marginTop: 3
        }}
      >
        <Text>{post.title}</Text>
        <Text>{post.price}</Text>
      </View>
    </Pressable>
  );
};
export default PostCard;
