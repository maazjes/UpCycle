import { ModalProps } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import Modal from './Modal';
import Text from './Text';
import Line from './Line';

interface Props extends ModalProps {
  menuItems: { [key: string]: () => void };
}

const MenuModal = ({ menuItems, ...props }: Props): JSX.Element => (
  <Modal {...props}>
    { Object.keys(menuItems).map((key): JSX.Element => (
      <View>
        <Line style={{ borderColor: '#161716' }} />
        <TouchableOpacity onPress={menuItems[key]}>
          <Text
            style={{ marginVertical: 13 }}
            align="center"
            size="subheading"
          >
            {key}
          </Text>
        </TouchableOpacity>
      </View>
    )) }
  </Modal>
);

export default MenuModal;
