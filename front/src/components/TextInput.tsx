import { TextInput as NativeTextInput, TextInputProps, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d5dbd7',
    borderRadius: 4,
    paddingLeft: 15
  }
});

interface Props extends TextInputProps {
  error: boolean;
}

const TextInput = ({ error, style, ...props }: Props): JSX.Element => {
  const textInputStyle = StyleSheet.flatten([styles.inputField, style, error && { borderColor: 'red', marginBottom: 5 }]);

  return <NativeTextInput style={textInputStyle} {...props} />;
};

export default TextInput;
