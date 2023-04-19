import { TextInput as NativeTextInput, TextInputProps, StyleSheet } from 'react-native';
import theme from 'styles/theme';
import { dpw } from 'util/helpers';

const styles = StyleSheet.create({
  inputField: {
    height: dpw(0.16),
    borderWidth: 1,
    borderColor: '#d5dbd7',
    borderRadius: 4,
    paddingLeft: dpw(0.035),
    fontSize: theme.fontSizes.body,
    backgroundColor: '#FAFAFA'
  }
});

interface Props extends TextInputProps {
  error: boolean;
  inputRef?: React.RefObject<NativeTextInput>;
}

const TextInput = ({ error, style, inputRef = undefined, ...props }: Props): JSX.Element => {
  const textInputStyle = [
    styles.inputField,
    style,
    error && { borderColor: 'red', marginBottom: 5 }
  ];

  return <NativeTextInput ref={inputRef} style={textInputStyle} {...props} />;
};

export default TextInput;
