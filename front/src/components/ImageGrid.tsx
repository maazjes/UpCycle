import { TypedImage } from '@shared/types';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigation } from 'types';

const styles = StyleSheet.create({
  image: {
    width: '10%',
    height: '10%'
  },
  images: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  }
});

interface ImageGridProps {
  images: TypedImage[];
}

const ImageGrid = ({ images }: ImageGridProps): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  return images.length > 1 ? (
    <View style={styles.images}>
      {images.map(
        (image, i): JSX.Element => (
          <Pressable
            key={image.id}
            onPress={(): void =>
              navigate('LightBox', { uri: `${images[i].uri}_original?alt=media` })
            }
          >
            <Image
              style={{
                height: 70,
                width: 70,
                borderRadius: 1
              }}
              source={{ uri: `${image.uri}_original?alt=media` }}
            />
          </Pressable>
        )
      )}
    </View>
  ) : (
    <Pressable
      style={{ width: '100%', aspectRatio: 1 }}
      onPress={(): void => navigate('LightBox', { uri: `${images[0].uri}_original?alt=media` })}
    >
      <Image
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 1
        }}
        source={{ uri: `${images[0].uri}_original?alt=media` }}
      />
    </Pressable>
  );
};

export default ImageGrid;
