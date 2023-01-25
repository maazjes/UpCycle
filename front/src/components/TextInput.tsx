import { TextInput as NativeTextInput, TextInputProps, StyleSheet } from 'react-native';

interface Props extends TextInputProps {
  error: boolean;
}

const TextInput = ({ style, error, ...props }: Props): JSX.Element => {
  const textInputStyle = StyleSheet.flatten([style, error && { borderColor: 'red', marginBottom: 5 }]);

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
