import {
  View, StyleSheet, Pressable, PressableProps, GestureResponderEvent
} from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  loginButton: {
    height: 50,
    backgroundColor: '#347deb',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  }
});

interface Props extends PressableProps {
  text?: string;
  element?: JSX.Element;
  onSubmit: (event: GestureResponderEvent) => void;
}

const Button = ({
  text = undefined, element = undefined, onSubmit, ...props
}: Props): JSX.Element => (
  <View style={{ display: 'flex' }}>
    <Pressable style={StyleSheet.flatten([styles.loginButton, props.style])} onPress={onSubmit}>
      {text ? <Text color="textSecondary">{text}</Text> : element}
    </Pressable>
  </View>
);

export default Button;
