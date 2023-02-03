import {
  StyleSheet, Image, View, TouchableOpacity
} from 'react-native';
import { useField } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import Button from './Button';
import Text from './Text';
import { TypedImage } from '../types';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  previewImageContainer: {
    marginHorizontal: 9,
    paddingVertical: 5
  },
  previewImage: {
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 0,
    borderColor: '#347deb'
  },
  previewImages: {
    paddingTop: 12,
    flexDirection: 'row',
    paddingBottom: 5,
    flexWrap: 'wrap'
  },
  deleteIcon: {
    position: 'absolute',
    right: -6,
    top: -1
  },
  circleIcon: {
    position: 'absolute',
    top: -1,
    left: -1
  }
});

const FormikImageInput = ({ name }: { name: string }): JSX.Element => {
  const [field, meta, helpers] = useField<TypedImage[]>(name);
  const showError = meta.touched;
  const { error } = meta;

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });
    if (!result.canceled) {
      const { width, height, uri } = result.assets[0];
      const aspectRatio = width / height;
      const image = {
        width, height, uri, tempId: `${uri}${aspectRatio}`
      };
      helpers.setValue(field.value.concat(image));
    }
  };

  const deletePreviewImage = (id?: string): void => {
    if (id) {
      const filtered = field.value.filter((image): boolean => image.tempId !== id);
      helpers.setValue(filtered);
    }
  };

  return (
    <>
      <Button handleSubmit={pickImage} text="Choose image" />
      {field.value.length > 0
      && (
        <View style={styles.previewImages}>
          {field.value.map((image): JSX.Element => {
            const aspectRatio = image.width / image.height;
            return (
              <View key={image.tempId} style={styles.previewImageContainer}>
                <Image
                  style={[styles.previewImage,
                    { aspectRatio, height: 80, width: aspectRatio * 80 }]}
                  source={{ uri: image.uri }}
                />
                <TouchableOpacity
                  onPress={
                    (): void => deletePreviewImage(image.tempId)
                  }
                  style={styles.deleteIcon}
                >
                  <FontAwesome style={styles.circleIcon} name="circle" size={30} color="white" />
                  <FontAwesome name="times-circle" size={28} color="rgb(22,48,60,0)" />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikImageInput;
