import { StyleSheet } from 'react-native';
import { useField } from 'formik';
import { dph, dpw } from 'util/helpers';
import { FormikTextInputProps } from 'types';
import Text from './Text';
import TextInput from './TextInput';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: dph(0.01),
    marginLeft: 1
  },
  inputField: {
    height: dph(0.09),
    borderWidth: 1,
    borderColor: '#d5dbd7',
    marginBottom: dph(0.018),
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
  const showError = touched && error !== undefined;

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
