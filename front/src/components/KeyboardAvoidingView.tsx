import { useHeaderHeight } from '@react-navigation/elements';
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  KeyboardAvoidingViewProps as NativeKeyboardAvoidingViewProps,
  Platform
} from 'react-native';

interface KeyboardAvoidingViewProps extends Omit<NativeKeyboardAvoidingViewProps, 'behavior'> {}

const KeyboardAvoidingView = ({
  style,
  keyboardVerticalOffset,
  ...props
}: KeyboardAvoidingViewProps): JSX.Element => {
  const headerHeight = useHeaderHeight();
  return (
    <NativeKeyboardAvoidingView
      {...props}
      keyboardVerticalOffset={keyboardVerticalOffset ?? headerHeight}
      style={[{ flex: 1 }, style]}
      {...(Platform.OS === 'ios' && { behavior: 'padding' })}
    />
  );
};

export default KeyboardAvoidingView;
