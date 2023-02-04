import {
  StyleSheet, View, ImageStyle, ViewStyle, Image, Dimensions, ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Carousel from './Carousel';
import Text from './Text';
import { TypedImage, PostBase } from '../types';

const { width } = Dimensions.get('window');

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
    <ScrollView contentContainerStyle={[{ paddingBottom: 500 }, containerStyle]}>
      <Carousel
        images={post.images}
      />
      <View style={styles.infoBox}>
        <View style={styles.titleAndPrice}>
          <Text fontWeight="bold" fontSize="subheading">{post.title}</Text>
          <Text fontSize="subheading" fontWeight="bold" color="blue">{post.price}</Text>
          <Text style={{ marginTop: 5 }}>{post.description}</Text>
        </View>
        <FontAwesome style={{ alignSelf: 'flex-start', margin: 10 }} name="bookmark" size={27} color="black" />
      </View>
    </ScrollView>
  );
};
export default SinglePostCard;
