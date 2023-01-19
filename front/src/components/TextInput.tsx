import { TextInput as NativeTextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {
  error: boolean;
}

const TextInput = ({ style, error, ...props }: Props): JSX.Element => {
  const textInputStyle = { ...(error && { borderColor: 'red', marginBottom: 0 }) };

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
