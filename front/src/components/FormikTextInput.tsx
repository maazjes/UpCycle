import { StyleSheet, TextInputProps } from 'react-native';
import { useField } from 'formik';

import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2,
    marginLeft: 1
  },
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d5dbd7',
    marginBottom: 10,
    borderRadius: 4,
    paddingLeft: 15
  }
});

interface Props extends TextInputProps {
  name: string;
}

const FormikTextInput = ({ name, style, ...props }: Props): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const { error, touched } = meta;
  const showError = (touched && error !== undefined);
  return (
    <>
      <TextInput
        style={StyleSheet.flatten([styles.inputField, style])}
        onChangeText={(value: string): void => helpers.setValue(value)}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikTextInput;
