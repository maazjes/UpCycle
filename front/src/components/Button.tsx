import {
  View, StyleSheet, Pressable, PressableProps, GestureResponderEvent
} from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  loginButton: {
    marginTop: 5,
    height: 50,
    backgroundColor: '#347deb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  }
});

interface Props extends PressableProps {
  text: string;
  handleSubmit: (event: GestureResponderEvent) => void;
}

const Button = ({ text, handleSubmit, ...props }: Props): JSX.Element => (
  <View style={{ display: 'flex' }}>
    <Pressable style={StyleSheet.flatten([styles.loginButton, props.style])} onPress={handleSubmit}>
      <Text>{text}</Text>
    </Pressable>
  </View>
);

export default Button;
