import { StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { PickerProps } from 'types';
import { dpw } from 'util/helpers';
import Text from './Text';
import MenuModal from './MenuModal';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pickerText: {
    marginRight: dpw(0.03)
  }
});

const Picker = ({
  selectedValue,
  items,
  onValueChange,
  searchbar = false,
  style,
  ...props
}: PickerProps): JSX.Element => {
  const [visible, setVisible] = useState(false);
  const menuModalItems = items.reduce(
    (a, v): {} => ({
      ...a,
      [v]: (): void => {
        onValueChange(v);
        setVisible(false);
      }
    }),
    {}
  );

  const closeModal = (): void => {
    setVisible(false);
  };

  const openModal = (): void => {
    setVisible(true);
  };

  return (
    <>
      <TouchableOpacity style={[styles.container, style]} onPress={openModal} {...props}>
        <Text style={styles.pickerText} size="heading">
          {selectedValue}
        </Text>
        <AntDesign name="caretdown" size={dpw(0.045)} color="black" />
      </TouchableOpacity>
      <MenuModal
        searchbar={searchbar}
        visible={visible}
        onDismiss={closeModal}
        items={menuModalItems}
        onRequestClose={closeModal}
      />
    </>
  );
};

export default Picker;
