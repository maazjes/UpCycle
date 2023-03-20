import { ModalProps } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import Modal from './Modal';
import Text from './Text';
import Line from './Line';

interface Props extends Omit<ModalProps, 'children'> {
  items: { [key: string]: (...args: any[]) => any };
}

const MenuModal = ({ items, ...props }: Props): JSX.Element => (
  <Modal {...props}>
    {Object.keys(items).map((key, i): JSX.Element => (
      <View key={key}>
        {i > 0 ? <Line style={{ borderColor: '#161716' }} /> : null}
        <TouchableOpacity onPress={items[key]}>
          <Text
            style={{ marginVertical: 15 }}
            align="center"
            size="subheading"
          >
            {key}
          </Text>
        </TouchableOpacity>
      </View>
    ))}
  </Modal>
);

export default MenuModal;
