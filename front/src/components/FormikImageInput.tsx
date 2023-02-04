import {
  StyleSheet, Image, View, Pressable, Dimensions
} from 'react-native';
import { useField } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Text from './Text';
import { TypedImage } from '../types';

const { width: windowWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  deleteIcon: {
    position: 'absolute',
    right: -6,
    top: -6
  },
  circleIcon: {
    position: 'absolute',
    top: -1,
    left: -1
  },
  imageBox: {
    height: windowWidth / 4,
    width: windowWidth / 4,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginVertical: 20
  },
  addedImage: {
    width: windowWidth / 4,
    height: windowWidth / 4
  }
});

const FormikImageInput = ({ name }: { name: string }): JSX.Element => {
  const [field, meta, helpers] = useField<TypedImage[]>(name);
  const showError = meta.touched;
  const { error } = meta;

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      const { width, height, uri } = result.assets[0];
      const aspectRatio = width / height;
      const image = {
        width, height, uri, id: `${uri}${aspectRatio}`
      };
      helpers.setValue(field.value.concat(image));
    }
  };

  const deletePreviewImage = (id: string): void => {
    if (id) {
      const filtered = field.value.filter((image): boolean => image.id !== id);
      helpers.setValue(filtered);
    }
  };

  return (
    <>
      <View style={styles.imageBoxes}>
        {(Array(3).fill(0)).map((_, i): JSX.Element => {
          const currentImage = field.value[i];
          if (field.value[i]) {
            return (
              <View key={currentImage.id}>
                <Image
                  style={styles.addedImage}
                  source={{ uri: currentImage.uri }}
                />
                <Pressable
                  onPress={
                    (): void => deletePreviewImage(currentImage.id)
                  }
                  style={styles.deleteIcon}
                >
                  <FontAwesome style={styles.circleIcon} name="circle" size={30} color="white" />
                  <FontAwesome name="times-circle" size={28} color="rgb(22,48,60,0)" />
                </Pressable>
              </View>
            );
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Pressable key={i * -1} onPress={pickImage} style={styles.imageBox}>
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
