import {
  StyleSheet, Image, View, ImageStyle, ViewStyle
} from 'react-native';
import Text from './Text';

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

const GridPost = ({
  title, price, imageUrl, description = '', imageStyle = {}, containerStyle = {}
}: {
  title: string;
  price: string;
  imageUrl: string;
  description?: string;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}): JSX.Element => (
  <View style={containerStyle}>
    <Image
      style={StyleSheet.flatten([styles.gridPostImage, imageStyle])}
      source={{ uri: imageUrl }}
    />
    <View style={styles.gridPostInfo}>
      <Text>{title}</Text>
      <Text>{price}</Text>
      <Text>{description}</Text>
    </View>
  </View>
);

export default GridPost;
