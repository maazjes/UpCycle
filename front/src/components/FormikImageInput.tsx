import { StyleSheet, Image, View } from 'react-native';
import { useField } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import Button from './Button';
import Text from './Text';
import { TypedImage } from '../types';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  previewImage: {
    width: '15%',
    marginHorizontal: 5,
    borderRadius: 3
  },
  previewImages: {
    marginTop: 10,
    flexDirection: 'row'
  }
});

const FormikImageInput = ({ name }: { name: string }): JSX.Element => {
  const [field, meta, helpers] = useField<ImagePicker.ImagePickerAsset[]>(name);
  const showError = meta.touched;
  const { error } = meta;
  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1
    });
    if (!result.canceled) {
      helpers.setValue(field.value.concat(result.assets[0]));
    }
  };
  return (
    <>
      <Button handleSubmit={pickImage} text="Choose image" />
      {field.value.length > 0
      && (
        <View style={styles.previewImages}>
          {field.value.map((image): JSX.Element => {
            const src = Image.resolveAssetSource({ uri: image.uri });
            return (
              <Image
                style={[{ aspectRatio: image.width / image.height },
                  styles.previewImage]}
                source={{ uri: src.uri }}
              />
            );
          })}
        </View>
      )}
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikImageInput;
