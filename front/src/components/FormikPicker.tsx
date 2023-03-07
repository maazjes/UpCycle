import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useField } from 'formik';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  }
});

interface Props {
  name: string;
  items: string[];
}

const FormikPicker = ({ name, items }: Props): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState('category');
  const [, meta, helpers] = useField<string>(name);
  const showError = meta.touched;
  const { error } = meta;

  return (
    <View>
      <Picker
        selectedValue={selectedItem}
        onValueChange={(itemValue): void => {
          helpers.setValue(itemValue);
          setSelectedItem(itemValue);
        }}
      >
        {items.map(
          (item): JSX.Element => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
            />
          )
        )}
      </Picker>
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormikPicker;
