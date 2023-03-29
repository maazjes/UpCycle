import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { PickerProps } from 'types';
import Text from './Text';
import MenuModal from './MenuModal';

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

  return (
    <View>
      <TouchableOpacity
        style={StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center'
          },
          style
        ])}
        onPress={(): void => setVisible(true)}
        {...props}
      >
        <Text style={{ marginRight: 15 }} size="heading">
          {selectedValue}
        </Text>
        <AntDesign name="caretdown" size={15} color="black" />
      </TouchableOpacity>
      <MenuModal
        searchbar={searchbar}
        visible={visible}
        onDismiss={closeModal}
        items={menuModalItems}
        onRequestClose={closeModal}
      />
    </View>
  );
};

export default Picker;
