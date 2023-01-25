import {
  StyleSheet, Image, View, ImageStyle, ViewStyle
} from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  gridPostText: {
    flexDirection: 'column',
    margin: 10
  },
  gridPostImage: {
    resizeMode: 'contain',
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 4,
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
    <View style={styles.gridPostText}>
      <Text>{title}</Text>
      <Text>{price}</Text>
      <Text>{description}</Text>
    </View>
  </View>
);

export default GridPost;
