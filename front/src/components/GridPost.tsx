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

const GridPost = ({ title, price }: { title: string; price: string }) => {
  // eslint-disable-next-line max-len
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const src = require('../../assets/icon.png');
  return (
    <View>
      <Image style={styles.gridPostImage} source={src} />
      <View style={styles.gridPostText}>
        <Text>{title}</Text>
        <Text>{price}</Text>
      </View>
    </View>
  );
};

export default GridPost;
