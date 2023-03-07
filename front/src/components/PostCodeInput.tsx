import { StyleSheet, View } from 'react-native';
import { useField } from 'formik';
// @ts-ignore
import * as postcodes from 'datasets-fi-postalcodes';
import { useEffect, useState } from 'react';
import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2,
    marginLeft: 2
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  postcodeInput: {
    width: '100%',
    marginBottom: 10
  },
  cityField: {
    marginBottom: 10,
    marginLeft: 4
  }
});

interface Location {
  city: string;
  postcode: string;
}

const PostCodeInput = ({ name }: { name: string }): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const [location, setLocation] = useState<Location>({ city: '', postcode: field.value });

  const handleOnChange = ({ postcode }: Location): void => {
    let cityToAdd = '';
    let postcodeToAdd = '';
    if (postcode.length === 5) {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const cityByCode = postcodes[postcode];
      if (cityByCode && typeof cityByCode === 'string') {
        cityToAdd = cityByCode;
        postcodeToAdd = postcode;
      }
    }
    helpers.setValue(postcodeToAdd);
    setLocation({ postcode, city: cityToAdd });
  };

  useEffect((): void => {
    if (field.value) {
      handleOnChange(location);
    }
  }, []);

  const { error, touched } = meta;
  const showError = touched && error !== undefined;
  const cityFieldValue = location.city;

  return (
    <View>
      <View style={styles.view}>
        <TextInput
          onChangeText={(postcode: string): void => handleOnChange({ ...location, postcode })}
          onBlur={(): void => helpers.setTouched(true)}
          value={location.postcode}
          error={showError}
          placeholder="Postcode"
          style={styles.postcodeInput}
        />
      </View>
      {showError
        ? <Text style={styles.errorText}>{error}</Text> : cityFieldValue
          ? <Text style={styles.cityField}>{cityFieldValue}</Text>
          : undefined}
    </View>
  );
};

export default PostCodeInput;
