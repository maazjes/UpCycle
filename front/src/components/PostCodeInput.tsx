import { StyleSheet, View } from 'react-native';
import { useField } from 'formik';
import * as postcodes from 'datasets-fi-postalcodes';
import TextInput from './TextInput';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  postcodeInput: {
    width: '49%',
    marginRight: '2%'
  },
  cityInput: {
    width: '49%',
    borderWidth: 0,
    color: '#737373'
  }
});

interface Location {
  city: string;
  postcode: string;
}

interface LocationError {
  city?: string;
  postcode?: string;
}

const PostCodeInput = ({ name }: { name: string }): JSX.Element => {
  const [field, meta, helpers] = useField<Location>(name);
  const error = meta.error as unknown as LocationError;
  const showError = meta.touched && error !== undefined;

  const handleOnChange = (location: Location): void => {
    const newLocation = { ...location };
    if (location.postcode.length === 5) {
      const cityByCode = postcodes[location.postcode];
      if (cityByCode && typeof cityByCode === 'string') {
        newLocation.city = cityByCode;
      }
    } else {
      newLocation.city = '';
    }
    helpers.setValue(newLocation);
  };

  const cityFieldStyle = StyleSheet.flatten([styles.cityInput, error?.city ? { color: 'red' } : {}]);
  const cityFieldError = meta.touched && error?.city;
  const cityFieldValue = field.value.city || cityFieldError;

  return (
    <View style={styles.view}>
      <TextInput
        onChangeText={(postcode: string): void => handleOnChange({ ...field.value, postcode })}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value.postcode}
        error={showError}
        placeholder="Postcode"
        style={styles.postcodeInput}
      />
      <TextInput
        onChangeText={(city: string): void => handleOnChange({ ...field.value, city })}
        value={cityFieldValue}
        error={false}
        editable={false}
        style={cityFieldStyle}
      />
    </View>
  );
};

export default PostCodeInput;
