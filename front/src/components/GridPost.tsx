import { StyleSheet, Image, View } from 'react-native';
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
  imageSrc,
  title,
  price
}: {
  imageSrc: string;
  title: string;
  price: string;
}) => (
  <View>
    {/* eslint-disable-next-line max-len */}
    {/* eslint-disable-next-line import/no-dynamic-require, global-require */}
    <Image style={styles.gridPostImage} source={require(imageSrc)} />
    <View style={styles.gridPostText}>
      <Text>{title}</Text>
      <Text>{price}</Text>
    </View>
  </View>
);

export default GridPost;
