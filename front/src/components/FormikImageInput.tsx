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
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  }
});

interface FormikImageInputProps {
  name: string;
  amount: number;
  maxAmount: number;
  containerStyle?: ViewStyle;
  circle?: boolean;
  initialImage?: JSX.Element;
  size?: number;
  imageStyle?: ViewStyle;
}

const FormikImageInput = ({
  name,
  amount,
  maxAmount,
  circle = false,
  containerStyle = undefined,
  initialImage = <MaterialIcons name="add-photo-alternate" size={30} color="black" />,
  size = dpw(0.3),
  imageStyle = undefined
}: FormikImageInputProps): JSX.Element => {
  const [field, , helpers] = useField<TypedImage[]>(name);
  const [menuModalItems, setMenuModalItems] = useState();

  const imagePickerOptions = {
    mediaTypes: MediaTypeOptions.Images,
    aspect: [1, 1] as [number, number],
    allowsEditing: true,
    quality: 1
  };

  const addImage = async (from: 'gallery' | 'camera', index: number): Promise<void> => {
    const images = await pickImage({
      ...imagePickerOptions,
      from
    });
    if (images) {
      const newImages = [...field.value];
      images.forEach((image, i): void => {
        newImages[index + i] = image;
      });
      helpers.setValue(newImages);
      setMenuModalItems(undefined);
    }
  };

  const onDeleteImage = (index: number): void => {
    const newImages = [...field.value];
    if (index === field.value.length - 1) {
      newImages.splice(-1);
    } else {
      delete newImages[index];
    }
    console.log(newImages.length);
    helpers.setValue(newImages);
    setMenuModalItems(undefined);
  };

  const addedImageStyle = circle
    ? [{ width: size, height: size }, { borderRadius: size / 2 }]
    : { width: size, height: size };

  const imageBoxStyle = circle
    ? [styles.imageBox, { borderRadius: size / 2, width: size, height: size }]
    : [styles.imageBox, { width: size, height: size }];

  return (
    <View style={[styles.imageBoxes, containerStyle]}>
      {Array(
        field.value.length < 3
          ? amount
          : field.value.length === maxAmount
          ? maxAmount
          : amount + field.value.length - 2
      )
        .fill(0)
        .map((_, i): JSX.Element => {
          const image: TypedImage | null =
            field.value[i] && field.value[i].uri ? field.value[i] : null;
          const addFromIndex = i === field.value.length ? i : field.value.length;
          const addImageItems = {
            Gallery: async (): Promise<void> => addImage('gallery', addFromIndex),
            Camera: (): Promise<void> => addImage('camera', addFromIndex)
          };
          const deleteImageItems = image && {
            Delete: (): void => onDeleteImage(i),
            'Add new': (): void => setMenuModalItems(addImageItems)
          };
          const newMenuModalItems = deleteImageItems || addImageItems;
          return (
            <View key={i} style={imageStyle}>
              {image ? (
                <Pressable onPress={(): void => setMenuModalItems(newMenuModalItems)}>
                  <Image
                    style={addedImageStyle}
                    source={{
                      uri: image.uri.startsWith('file')
                        ? image.uri
                        : `${image.uri}_100x100?alt=media`
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={(): void => setMenuModalItems(newMenuModalItems)}
                  style={imageBoxStyle}
                >
                  {initialImage}
                </Pressable>
              )}
            </View>
          );
        })}
      {menuModalItems && (
        <MenuModal
          items={menuModalItems}
          visible={!!menuModalItems}
          onDismiss={(): void => setMenuModalItems(undefined)}
        />
      )}
    </View>
  );
};

export default FormikImageInput;
