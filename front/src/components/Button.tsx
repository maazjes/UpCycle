import { View, StyleSheet, Pressable, PressableProps } from 'react-native';
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

const Button = ({
  text,
  handleSubmit,
  ...props
}: {
  text: string;
  handleSubmit: Function;
  props: PressableProps;
}) => (
  <View style={{ display: 'flex' }}>
    <Pressable style={[styles.loginButton, props.style]} onPress={handleSubmit}>
      <Text fontWeight="bold">{text}</Text>
    </Pressable>
  </View>
);

export default Button;
