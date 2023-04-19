import {
  Modal as NativeModal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  ModalProps as NativeModalProps,
  ViewStyle
} from 'react-native';
import { dpw } from 'util/helpers';
import KeyboardAvoidingView from './KeyboardAvoidingView';

const styles = StyleSheet.create({
  innerContainer: {
    flexShrink: 1,
    backgroundColor: 'white',
    width: '80%',
    maxHeight: '60%',
    borderRadius: dpw(0.03),
    overflow: 'hidden'
  },
  outerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  }
});

interface ModalProps extends NativeModalProps {
  onPress?: () => void;
  innerContainerStyle?: ViewStyle;
  avoidKeyboard?: boolean;
}

const Modal = ({
  style,
  children,
  onPress = undefined,
  innerContainerStyle = undefined,
  avoidKeyboard = false,
  ...props
}: ModalProps): JSX.Element => (
  <NativeModal statusBarTranslucent transparent {...props}>
    <TouchableWithoutFeedback onPressOut={props.onDismiss}>
      <KeyboardAvoidingView enabled={avoidKeyboard} style={styles.outerContainer}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={[styles.innerContainer, innerContainerStyle]}>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  </NativeModal>
);

export default Modal;
