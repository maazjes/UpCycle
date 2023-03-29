import {
  Modal as NativeModal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ModalProps
} from 'react-native';

const styles = StyleSheet.create({});

const Modal = ({ style, children, ...props }: ModalProps): JSX.Element => (
  <NativeModal transparent {...props}>
    <TouchableWithoutFeedback onPressOut={props.onDismiss}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <View
          style={{
            flexShrink: 1,
            backgroundColor: 'white',
            width: '80%',
            maxHeight: '60%',
            borderRadius: 10
          }}
        >
          {children}
        </View>
      </View>
    </TouchableWithoutFeedback>
  </NativeModal>
);

export default Modal;
