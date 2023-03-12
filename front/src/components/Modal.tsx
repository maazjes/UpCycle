import { ModalProps, Modal as PaperModal, Portal } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    width: '70%'
  }
});

const Modal = ({ style, ...props }: ModalProps): JSX.Element => (
  <Portal>
    <PaperModal
      contentContainerStyle={styles.modal}
      {...props}
    />
  </Portal>
);

export default Modal;
