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
  onSubmit: (event: GestureResponderEvent) => void;
}

const Button = ({ text, onSubmit, ...props }: Props): JSX.Element => (
  <View style={{ display: 'flex' }}>
    <Pressable style={StyleSheet.flatten([styles.loginButton, props.style])} onPress={onSubmit}>
      <Text color="textSecondary">{text}</Text>
    </Pressable>
  </View>
);

export default Button;
