import { StyleSheet, Image, View, Pressable, ViewStyle } from 'react-native';
import { useField } from 'formik';
import { MediaTypeOptions } from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { TypedImage } from '@shared/types';
import { dpw, pickImage } from 'util/helpers';
import { useState } from 'react';
import Text from './Text';
import MenuModal from './MenuModal';

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
    marginVertical: 10,
    marginHorizontal: 5
  }
});

interface FormikImageInputProps {
  name: string;
  amount: number;
  containerStyle?: ViewStyle;
  circle?: boolean;
}

const FormikImageInput = ({
  name,
  amount,
  circle = false,
  containerStyle = {}
}: FormikImageInputProps): JSX.Element => {
  const [field, meta, helpers] = useField<TypedImage[]>(name);
  const [modalVisible, setModalVisible] = useState(false);
  const showError = meta.touched;
  const { error } = meta;

  const imagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    aspect: [1, 1] as [number, number],
    allowsEditing: true,
    quality: 1
  };

  const addImage = async (from: 'gallery' | 'camera'): Promise<void> => {
    const image = await pickImage({
      ...imagePickerOptions,
      from
    });
    setModalVisible(false);
    if (image) {
      helpers.setValue(field.value.concat(image));
    }
  };

  const deleteImage = async (imageId: number): Promise<void> => {
    const filtered = field.value.filter((image): boolean => image.id !== imageId);
    helpers.setValue(filtered);
  };

  const menuModalItems = {
    Gallery: (): Promise<void> => addImage('gallery'),
    Camera: (): Promise<void> => addImage('camera')
  };

  const addedImageStyle = circle
    ? [styles.addedImage, { borderRadius: dpw(0.15) }]
    : styles.addedImage;

  const imageBoxStyle = circle ? [styles.imageBox, { borderRadius: dpw(0.15) }] : styles.imageBox;

  return (
    <>
      <View style={[styles.imageBoxes, containerStyle]}>
        {Array(amount)
          .fill(0)
          .map((_, i): JSX.Element => {
            const currentImage = field.value[i];
            if (currentImage) {
              return (
                <Pressable
                  key={currentImage.id || currentImage.uri}
                  onPress={(): Promise<void> => deleteImage(currentImage.id)}
                >
                  <Image style={addedImageStyle} source={{ uri: currentImage.uri }} />
                </Pressable>
              );
            }
            return (
              <Pressable
                // eslint-disable-next-line react/no-array-index-key
                key={i * -1}
                onPress={(): void => setModalVisible(true)}
                style={imageBoxStyle}
              >
                <MaterialIcons name="add-photo-alternate" size={30} color="black" />
              </Pressable>
            );
          })}
      </View>
      <MenuModal
        items={menuModalItems}
        visible={modalVisible}
        onDismiss={(): void => setModalVisible(false)}
      />
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikImageInput;
