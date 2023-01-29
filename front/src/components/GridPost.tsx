import {
  StyleSheet, View, ImageStyle, ViewStyle
} from 'react-native';
import Text from './Text';
import OriginalImage from './OriginalImage';
import { PostBase } from '../types';

const styles = StyleSheet.create({
  gridPostInfo: {
    flexDirection: 'column',
    margin: 10
  },
  gridPostImage: {
    borderWidth: 1,
    borderColor: 's#ff00ff'
  }
});

interface GridPostProps {
  post: PostBase;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}

const GridPost = ({
  post, imageStyle = {}, containerStyle = {}
}: GridPostProps): JSX.Element => (
  <View style={containerStyle}>
    <OriginalImage
      style={imageStyle}
      source={{ uri: post.imageUrl }}
    />
    <View style={styles.gridPostInfo}>
      <Text>{post.title}</Text>
      <Text>{post.price}</Text>
      <Text>{post.description}</Text>
    </View>
  </View>
);

export default GridPost;
