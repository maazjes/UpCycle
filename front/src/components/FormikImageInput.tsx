import { StyleSheet, TextInputProps } from 'react-native';
import { useField } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import Button from './Button';
import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  loginField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d5dbd7',
    marginBottom: 10,
    borderRadius: 4,
    paddingLeft: 15,
    display: 'none'
  }
});

interface Props extends TextInputProps {
  name: string;
}

const FormikImageInput = ({ name, ...props }: Props): JSX.Element => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched;
  const { error } = meta;

  const pickImage = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled) {
      helpers.setValue(result.assets[0].uri);
    }
  };

  return (
    <>
      <TextInput
        style={styles.loginField}
        onChangeText={(value: string): void => helpers.setValue(value)}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      <Button handleSubmit={pickImage} text="Choose image" />
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikImageInput;
