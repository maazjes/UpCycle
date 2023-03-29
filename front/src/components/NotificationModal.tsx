import { ModalProps } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useAppSelector, useAppDispatch } from 'hooks/redux';
import { NotificationState } from 'types';
import { deleteNotification } from 'reducers/notificationReducer';
import Modal from './Modal';
import Text from './Text';
import Line from './Line';

interface Props extends Omit<ModalProps, 'children' | 'visible' | 'onDismiss'> {}

const NotificationModal = (props: Props): JSX.Element => {
  const notification = useAppSelector((state): NotificationState => state.notification);
  const dispatch = useAppDispatch();
  const { message, modal } = notification;
  const hideModal = (): { payload: undefined; type: 'notification/deleteNotification' } =>
    dispatch(deleteNotification());

  return (
    <Modal visible={!!message && modal} onDismiss={hideModal} {...props}>
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
          {message}
        </Text>
        <Line />
        <TouchableOpacity onPress={hideModal}>
          <Text style={{ marginVertical: 10 }} align="center">
            ok
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default NotificationModal;
