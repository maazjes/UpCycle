import { StyleSheet, View, ViewProps } from 'react-native';
import { useField } from 'formik';
import Text from './Text';
import Picker from './Picker';

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginTop: 2
  }
});

interface Props extends ViewProps {
  name: string;
  items: string[];
  initialValue: string;
}

const FormikPicker = ({ name, items, initialValue, ...props }: Props): JSX.Element => {
  const [field, meta, helpers] = useField<string>(name);
  const showError = meta.touched;
  const { error } = meta;
  console.log(field.value);
  return (
    <View {...props}>
      <Picker
        items={items}
        selectedValue={field.value || initialValue}
        onValueChange={(value): void => {
          helpers.setValue(value!);
        }}
      />
      {showError && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default FormikPicker;
