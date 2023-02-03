import {
  StyleSheet, View, ImageStyle, ViewStyle, Image, Pressable
} from 'react-native';
import Text from './Text';
import Button from './Button';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  titleAndPrice: {
    flexDirection: 'column'
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingTop: 8,
    justifyContent: 'space-between'
  },
  container: {
  }
});

interface GridPostProps {
  post: PostBase;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}

const SinglePostCard = ({
  post, imageStyle = {}, containerStyle = {}
}: GridPostProps): JSX.Element => {
  console.log(post);

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        style={imageStyle}
        source={{ uri: post.images[0].url }}
      />
      <View style={styles.infoBox}>
        <View style={styles.titleAndPrice}>
          <Text fontSize="subheading">{post.title}</Text>
          <Text fontSize="subheading" fontWeight="bold" color="blue">{post.price}</Text>
          <Text style={{ marginTop: 5 }}>{post.description}</Text>
        </View>
      </View>
    </View>
  );
};
export default SinglePostCard;
