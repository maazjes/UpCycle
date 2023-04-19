import { StyleSheet } from 'react-native';
import { useField } from 'formik';
import { dpw } from 'util/helpers';
import { FormikTextInputProps } from 'types';
import Text from './Text';
import TextInput from './TextInput';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: dpw(0.02),
    marginLeft: 1
  },
  inputField: {
    height: dpw(0.16),
    borderWidth: 1,
    borderColor: '#d5dbd7',
    marginBottom: dpw(0.03),
    borderRadius: 4,
    paddingLeft: dpw(0.035)
  }
});

const FormikTextInput = ({
  name,
  inputRef = undefined,
  style,
  ...props
}: FormikTextInputProps): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const { error, touched } = meta;
  const showError = (touched && error !== undefined) || error === 'Username already exists';

  return (
    <>
      <TextInput
        inputRef={inputRef}
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
