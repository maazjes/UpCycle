import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View
} from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { TypedImage } from '@shared/types';
import { dpw } from 'util/helpers';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatListContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  dot: {
    height: dpw(0.025),
    width: dpw(0.025),
    backgroundColor: '#bbb',
    borderRadius: dpw(0.025 / 2),
    marginHorizontal: dpw(0.01)
  },
  dots: {
    flexDirection: 'row',
    marginTop: dpw(0.025)
  },
  singleImage: {
    width,
    height: width
  }
});

const Carousel = ({
  images,
  dots = true,
  imageStyle = styles.singleImage
}: {
  images: TypedImage[];
  dots?: boolean;
  imageStyle?: ImageStyle;
}): JSX.Element => {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(index);
  indexRef.current = index;

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const slideIndex = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(slideIndex);
    const distance = Math.abs(roundIndex - slideIndex);
    const isNoMansLand = distance > 0.4;
    if (roundIndex !== indexRef.current && !isNoMansLand && dots) {
      setIndex(roundIndex);
    }
  }, []);

  const renderDots = (): JSX.Element => (
    <View style={styles.dots}>
      {images.length > 1
        ? images.map(
            (image, i): JSX.Element =>
              i === index ? (
                <View key={image.uri} style={[styles.dot, { backgroundColor: 'green' }]} />
              ) : (
                <View key={image.uri} style={styles.dot} />
              )
          )
        : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={images}
        renderItem={({ item }): JSX.Element => (
          <Image style={imageStyle} source={{ uri: item.uri }} />
        )}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item): string => String(item.id)}
      />
      {dots && images.length > 1 && renderDots()}
    </View>
  );
};

export default Carousel;
