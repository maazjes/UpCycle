import { StyleSheet, View } from 'react-native';
import { useField } from 'formik';
import * as postcodes from 'datasets-fi-postalcodes';
import { useState } from 'react';
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

const PostCodeInput = ({ name }: { name: string }): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const [location, setLocation] = useState<Location>({ city: '', postcode: '' });
  const { error, touched } = meta;
  const showError = touched && error !== undefined;
  console.log(field.value);

  const handleOnChange = ({ postcode }: Location): void => {
    let cityToAdd = '';
    let postcodeToAdd = '';
    if (postcode.length === 5) {
      const cityByCode = postcodes[postcode];
      if (cityByCode && typeof cityByCode === 'string') {
        cityToAdd = cityByCode;
        postcodeToAdd = postcode;
      }
    }
    helpers.setValue(postcodeToAdd);
    setLocation({ postcode, city: cityToAdd });
  };

  const cityFieldStyle = StyleSheet.flatten([styles.cityInput, error ? { color: 'red' } : {}]);
  const cityFieldError = touched ? error : undefined;
  const cityFieldValue = location.city || cityFieldError;

  return (
    <View style={styles.view}>
      <TextInput
        onChangeText={(postcode: string): void => handleOnChange({ ...location, postcode })}
        onBlur={(): void => helpers.setTouched(true)}
        value={location.postcode}
        error={showError}
        placeholder="Postcode"
        style={styles.postcodeInput}
      />
      <TextInput
        onChangeText={(): null => null}
        value={cityFieldValue}
        error={false}
        editable={false}
        style={cityFieldStyle}
      />
    </View>
  );
};

export default PostCodeInput;
