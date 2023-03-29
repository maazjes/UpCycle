import { TypedImage } from '@shared/types';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigation } from 'types';

const styles = StyleSheet.create({
  image: {
    width: '10%',
    height: '10%'
  },
  singleImage: {},
  images: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
});

const ImageGrid = ({ images }: { images: TypedImage[] }): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  return images.length > 1 ? (
    <View style={styles.images}>
      {images.map(
        (image): JSX.Element => (
          <Pressable key={image.id} onPress={(): void => navigate('LightBox', { uri: image.uri })}>
            <Image
              style={{
                aspectRatio: 1,
                height: 70,
                width: 70,
                borderRadius: 1
              }}
              source={{ uri: image.uri }}
            />
          </Pressable>
        )
      )}
    </View>
  ) : (
    <Pressable
      style={{ width: '100%', aspectRatio: 1 }}
      onPress={(): void => navigate('LightBox', { uri: images[0].uri })}
    >
      <Image
        style={{
          flex: 1,
          borderRadius: 1
        }}
        source={{ uri: images[0].uri }}
      />
    </Pressable>
  );
};

export default ImageGrid;
