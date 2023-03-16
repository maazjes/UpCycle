import {
  StyleSheet, Image, View, Pressable, ViewStyle
} from 'react-native';
import { useField } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { TypedImage } from '@shared/types';
import { dpw } from 'util/helpers';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: '10%',
    marginTop: 2
  },
  imageBox: {
    height: dpw(0.3),
    width: dpw(0.3),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginHorizontal: 5
  },
  imageBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  addedImage: {
    width: dpw(0.3),
    height: dpw(0.3),
    marginVertical: 10
  }
});

interface FormikImageInputProps {
  name: string;
  amount: number;
  containerStyle?: ViewStyle;
  circle?: boolean;
}

const FormikImageInput = ({
  name, amount, circle = false, containerStyle = {}
}: FormikImageInputProps): JSX.Element => {
  const [field, meta, helpers] = useField<TypedImage[]>(name);
  const showError = meta.touched;
  const { error } = meta;

  const pickImage = async (): Promise<TypedImage | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1
    });
    if (result.canceled) {
      return null;
    }
    const { width, height, uri } = result.assets[0];
    const aspectRatio = width / height;
    const image = {
      width, height, uri, id: aspectRatio * Math.random()
    };
    return image;
  };

  const addImage = async (): Promise<void> => {
    const image = await pickImage();
    if (image) {
      helpers.setValue(field.value.concat(image));
    }
  };

  const deleteAndAddImage = async (imageId: number): Promise<void> => {
    let filtered = field.value.filter((image): boolean => image.id !== imageId);
    const image = await pickImage();
    if (image) {
      filtered = filtered.concat(image);
    }
    helpers.setValue(filtered);
  };

  const addedImageStyle = circle
    ? [styles.addedImage, { borderRadius: dpw(0.15) }]
    : styles.addedImage;

  const imageBoxStyle = circle
    ? [styles.imageBox, { borderRadius: dpw(0.15) }]
    : styles.imageBox;

  return (
    <>
      <View style={[styles.imageBoxes, containerStyle]}>
        {(Array(amount).fill(0)).map((_, i): JSX.Element => {
          const currentImage = field.value[i];
          if (currentImage) {
            return (
              <Pressable
                key={currentImage.id || currentImage.uri}
                onPress={(): Promise<void> => deleteAndAddImage(currentImage.id)}
              >
                <Image
                  style={addedImageStyle}
                  source={{ uri: currentImage.uri }}
                />

              </Pressable>
            );
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Pressable key={i * -1} onPress={addImage} style={imageBoxStyle}>
              <MaterialIcons name="add-photo-alternate" size={30} color="black" />
            </Pressable>
          );
        })}
      </View>
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikImageInput;
