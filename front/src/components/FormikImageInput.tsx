import { StyleSheet, TextInputProps } from 'react-native';
import { useField } from 'formik';

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
    paddingLeft: 15
  }
});

const FormikImageInput = ({ name, ...props }: { name: string; props: TextInputProps }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched;
  const error = meta.error;
  return (
    <>
      <TextInput
        style={styles.loginField}
        onChangeText={(value: string) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikImageInput;
