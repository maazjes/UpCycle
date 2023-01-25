import { StyleSheet, TextInputProps } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useField } from 'formik';
import TextInput from './TextInput';
import Text from './Text';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  },
  inputField: {
    display: 'none'
  }
});

interface Item {
  name: string;
}
interface Props extends TextInputProps {
  name: string;
  items: Item[];
}

const FormikPicker = ({ name, items, ...props }: Props): JSX.Element => {
  // @ts-ignore
  const [selectedCategory, setSelectedCategory] = useState(items[0].name);
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched;
  const { error } = meta;

  return (
    <>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue): void => {
          helpers.setValue(itemValue);
          setSelectedCategory(itemValue);
        }}
      >
        {items.map(
          (item): JSX.Element => (
            <Picker.Item
              key={item.name}
              label={item.name}
              value={item.name}
            />
          )
        )}
      </Picker>
      <TextInput
        style={styles.inputField}
        onChangeText={(value: string): void => helpers.setValue(value)}
        onBlur={(): void => helpers.setTouched(true)}
        value={field.value}
        error={showError}
        {...props}
      />
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

export default FormikPicker;
