import { StyleSheet, TextInputProps } from 'react-native';
import { useField } from 'formik';
import { dph, dpw } from 'util/helpers';
import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: dph(0.015),
    marginTop: dph(0.003),
    marginLeft: 1
  },
  inputField: {
    height: dph(0.08),
    borderWidth: 1,
    borderColor: '#d5dbd7',
    marginBottom: dph(0.015),
    borderRadius: 4,
    paddingLeft: dpw(0.035)
  }
});

interface Props extends TextInputProps {
  name: string;
}

const FormikTextInput = ({ name, style, ...props }: Props): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const { error, touched } = meta;
  const showError = touched && error !== undefined;
  return (
    <>
      <TextInput
        style={[styles.inputField, style]}
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
