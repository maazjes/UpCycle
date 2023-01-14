import { TextInput as NativeTextInput, TextInputProps } from 'react-native';

const TextInput = ({
  style,
  error,
  ...props
}: {
  style: object;
  error: boolean;
  props: TextInputProps;
}) => {
  const textInputStyle = { ...style, ...(error && { borderColor: 'red', marginBottom: 0 }) };

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
