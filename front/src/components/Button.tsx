import {
  View, StyleSheet, Pressable, PressableProps, GestureResponderEvent
} from 'react-native';
import { dph } from 'util/helpers';
import Text from './Text';

const styles = StyleSheet.create({
  button: {
    height: dph(0.08),
    backgroundColor: '#4ad34a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 10
  }
});

interface Props extends PressableProps {
  text?: string;
  element?: JSX.Element;
  onPress: (event: GestureResponderEvent) => void;
}

const Button = ({
  text = undefined, element = undefined, onPress, ...props
}: Props): JSX.Element => (
  <View style={{ display: 'flex' }}>
    <Pressable style={StyleSheet.flatten([styles.button, props.style])} onPress={onPress}>
      {text ? <Text weight="bold" color="textSecondary">{text}</Text> : element}
    </Pressable>
  </View>
);

export default Button;
