import { StyleSheet, Image, View, Pressable, ViewStyle } from 'react-native';
import { useField } from 'formik';
import { MediaTypeOptions } from 'expo-image-picker';
import { TypedImage } from '@shared/types';
import { dpw, pickImage } from 'util/helpers';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import MenuModal from './MenuModal';

const styles = StyleSheet.create({
  imageBox: {
    height: dpw(0.3),
    width: dpw(0.3),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  addedImage: {
    width: dpw(0.3),
    height: dpw(0.3)
  }
});

interface FormikImageInputProps {
  name: string;
  amount: number;
  containerStyle?: ViewStyle;
  circle?: boolean;
  initialImage?: JSX.Element;
}

const FormikImageInput = ({
  name,
  amount,
  circle = false,
  containerStyle = {},
  initialImage = <MaterialIcons name="add-photo-alternate" size={30} color="black" />
}: FormikImageInputProps): JSX.Element => {
  const [field, , helpers] = useField<TypedImage[]>(name);
  const [imagePickerAction, setImagePickerAction] = useState<
    [boolean, 'camera' | 'gallery' | undefined]
  >([false, undefined]);
  const [delModalVisible, setDelModalVisible] = useState(false);

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
    if (image) {
      helpers.setValue(field.value.concat(image));
    }
  };

  const onDeleteImage = (imageId: number): void => {
    const filtered = field.value.filter((image): boolean => image.id !== imageId);
    helpers.setValue(filtered);
    setDelModalVisible(false);
  };

  const addImageItems = {
    Gallery: async (): Promise<void> => {
      await addImage('gallery');
      setImagePickerAction([false, 'gallery']);
    },
    Camera: (): void => setImagePickerAction([true, 'camera'])
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
            const { uri, id } = field.value[i] ? field.value[i] : { uri: null, id: null };
            const deleteImageItems = uri && {
              Delete: (): void => onDeleteImage(id)
            };
            console.log(field.value);
            return deleteImageItems ? (
              <View key={id || uri}>
                <Pressable onPress={(): void => setDelModalVisible(true)}>
                  <Image
                    style={addedImageStyle}
                    source={{ uri: uri.startsWith('file') ? uri : `${uri}_100x100?alt=media` }}
                  />
                </Pressable>
                <MenuModal
                  items={deleteImageItems}
                  visible={delModalVisible}
                  onDismiss={(): void => setDelModalVisible(false)}
                />
              </View>
            ) : (
              <Pressable
                // eslint-disable-next-line react/no-array-index-key
                key={i * -1}
                onPress={(): void => setImagePickerAction([true, undefined])}
                style={imageBoxStyle}
              >
                {initialImage}
              </Pressable>
            );
          })}
      </View>
      <MenuModal
        items={addImageItems}
        visible={imagePickerAction[0]}
        onDismiss={(): void => setImagePickerAction([false, undefined])}
      />
    </>
  );
};

export default FormikImageInput;
