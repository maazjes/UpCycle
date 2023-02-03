import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const SPACING = 5;
const ITEM_LENGTH = width;
const BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  container: {},
  itemContent: {
    marginHorizontal: SPACING * 3,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS + SPACING * 2
  },
  itemText: {
    fontSize: 24,
    position: 'absolute',
    bottom: SPACING * 2,
    right: SPACING * 2,
    color: 'white',
    fontWeight: '600'
  },
  itemImage: {
    width: '100%',
    borderRadius: BORDER_RADIUS,
    resizeMode: 'cover'
  }
});

const Carousel: FC<ImageCarouselProps> = ({ data }) => {
  console.log(data);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <View style={{ width: ITEM_LENGTH, height: item.height }}>
            <View style={styles.itemContent}>
              <Image source={{ uri: item.url, width: item.width, height: item.height }} style={styles.itemImage} />
            </View>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Carousel;
