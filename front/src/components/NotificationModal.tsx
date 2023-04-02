import { ModalProps } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import Modal from './Modal';
import Text from './Text';
import Line from './Line';

interface Props extends Omit<ModalProps, 'children'> {
  text: string;
}

const NotificationModal = ({ text, ...props }: Props): JSX.Element => (
  <Modal {...props}>
    <View>
      <Text
        weight="bold"
        style={{ marginTop: 15, marginBottom: 10 }}
        size="subheading"
        align="center"
      >
        Error
      </Text>
      <Text style={{ marginBottom: 15, marginHorizontal: 15 }} align="center">
        {text}
      </Text>
      <Line />
      <TouchableOpacity onPress={props.onDismiss}>
        <Text style={{ marginVertical: 10 }} align="center">
          ok
        </Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

export default NotificationModal;
