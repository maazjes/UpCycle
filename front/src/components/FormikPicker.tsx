import { View, ViewProps } from 'react-native';
import { useField } from 'formik';
import Picker from './Picker';

interface FormikPickerProps extends ViewProps {
  name: string;
  items: string[];
  initialValue: string;
}

const FormikPicker = ({ name, items, initialValue, ...props }: FormikPickerProps): JSX.Element => {
  const [field, , helpers] = useField<string>(name);

  return (
    <View {...props}>
      <Picker
        items={items}
        selectedValue={field.value || initialValue}
        onValueChange={(value): void => {
          helpers.setValue(value!);
        }}
      />
    </View>
  );
};

export default FormikPicker;
