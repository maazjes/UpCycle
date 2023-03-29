import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View
} from 'react-native';
import { useCallback, useRef, useState } from 'react';
import { TypedImage } from '@shared/types';

const { width: windowWidth } = Dimensions.get('window');

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
    height: 10,
    width: 10,
    backgroundColor: '#bbb',
    borderRadius: 25,
    marginTop: 5,
    marginHorizontal: 3
  },
  dots: {
    flexDirection: 'row'
  },
  singleImage: {
    width: windowWidth,
    height: windowWidth,
    flex: 1
  }
});

const Carousel = ({
  images,
  dots = false
}: {
  images: TypedImage[];
  dots?: boolean;
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
    if (roundIndex !== indexRef.current && !isNoMansLand) {
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
          <Image style={styles.singleImage} source={{ uri: item.uri }} />
        )}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item): string => String(item.id)}
      />
      {dots ? renderDots() : null}
    </View>
  );
};

export default Carousel;
