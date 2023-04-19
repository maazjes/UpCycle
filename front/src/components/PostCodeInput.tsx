import { StyleSheet } from 'react-native';
import { useField } from 'formik';
// @ts-ignore
import * as postcodes from 'datasets-fi-postalcodes';
import { dpw } from 'util/helpers';
import { FormikTextInputProps } from 'types';
import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: dpw(0.02),
    marginLeft: 2
  },
  postcodeInput: {
    marginBottom: dpw(0.03),
    height: dpw(0.16)
  },
  cityField: {
    marginBottom: dpw(0.03),
    marginTop: dpw(0.02),
    marginLeft: dpw(0.01)
  }
});

const PostCodeInput = ({
  name,
  inputRef = undefined,
  ...props
}: FormikTextInputProps): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const [cityField, , cityHelpers] = useField<string>('city');

  const handleOnChange = (postcode: string): void => {
    let cityToAdd = '';
    helpers.setValue(postcode);
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const cityByCode = postcodes.heavy[postcode]?.municipal_name_fi;
    if (cityByCode && typeof cityByCode === 'string') {
      cityToAdd = cityByCode;
    }
    cityHelpers.setValue(cityToAdd);
  };

  const { error, touched } = meta;
  const showError = touched && error !== undefined && !cityField.value;

  return (
    <>
      <TextInput
        inputRef={inputRef}
        onChangeText={(postcode: string): void => handleOnChange(postcode)}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        style={!cityField.value && styles.postcodeInput}
        {...props}
      />
      {showError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : cityField.value ? (
        <Text style={styles.cityField}>{cityField.value}</Text>
      ) : undefined}
    </>
  );
};

export default PostCodeInput;
