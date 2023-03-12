import {
  View, StyleSheet, Pressable, PressableProps, GestureResponderEvent
} from 'react-native';
import { dph, dpw } from 'util/helpers';
import Text from './Text';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4ad34a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    paddingVertical: dpw(0.04),
    paddingHorizontal: dpw(0.06)
  },
  small: {
    paddingVertical: dpw(0.02),
    paddingHorizontal: dpw(0.03)
  },
  o: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: dpw(0.005),
    paddingVertical: dpw(0.02 - 0.005),
    paddingHorizontal: dpw(0.03 - 0.005)
  }
});

interface Props extends PressableProps {
  text?: string;
  element?: JSX.Element;
  onPress: (event: GestureResponderEvent) => void;
  size?: 'small' | 'regular';
  o?: boolean;
}

const Button = ({
  text = undefined, element = undefined, onPress, size = 'regular', o = false, style, ...props
}: Props): JSX.Element => {
  const buttonStyle = [
    styles.button,
    size === 'small' && styles.small,
    o && styles.o
  ];

  return (
    <View style={{ display: 'flex' }}>
      <Pressable style={StyleSheet.flatten([buttonStyle, style])} {...props} onPress={onPress}>
        {text ? <Text weight="bold" color={o ? 'primary' : 'secondary'}>{text}</Text> : element}
      </Pressable>
    </View>
  );
};

export default Button;
