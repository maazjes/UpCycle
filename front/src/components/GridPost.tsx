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

const GridPost = ({ title, price, imageUrl }: { title: string; price: string; imageUrl: string }): JSX.Element => {
  console.log(imageUrl);
  return (
    <View>
      <Image style={styles.gridPostImage} source={{ uri: imageUrl }} />
      <View style={styles.gridPostText}>
        <Text>{title}</Text>
        <Text>{price}</Text>
      </View>
    </View>
  );
};
export default GridPost;
