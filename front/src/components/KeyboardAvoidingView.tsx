import { useHeaderHeight } from '@react-navigation/elements';
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform
} from 'react-native';

const KeyboardAvoidingView = (
  props: Omit<KeyboardAvoidingViewProps, 'KeyboardVerticalOffset' | 'behavior' | 'style'>
): JSX.Element => {
  const headerHeight = useHeaderHeight();
  return (
    <NativeKeyboardAvoidingView
      {...props}
      keyboardVerticalOffset={headerHeight}
      style={{ flex: 1 }}
      {...(Platform.OS === 'ios' && { behavior: 'padding' })}
    />
  );
};

export default KeyboardAvoidingView;
