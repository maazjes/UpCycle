import {
  StyleSheet,
  Pressable,
  PressableProps,
  GestureResponderEvent
} from 'react-native';
import { dpw } from 'util/helpers';
import theme from 'styles/theme';
import Text from './Text';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4ad34a',
    alignItems: 'center',
    justifyContent: 'center'
  },
  regular: {
    borderRadius: dpw(0.03),
    paddingVertical: dpw(0.035),
    paddingHorizontal: dpw(0.06)
  },
  small: {
    paddingVertical: dpw(0.017),
    paddingHorizontal: dpw(0.027)
  },
  o: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: dpw(0.005),
    paddingVertical: dpw(0.035 - 0.005),
    paddingHorizontal: dpw(0.027 - 0.005)
  },
  oSmall: {
    paddingVertical: dpw(0.017 - 0.005),
    paddingHorizontal: dpw(0.027 - 0.005)
  }
});

interface Props extends PressableProps {
  text?: string;
  element?: JSX.Element;
  onPress: (event: GestureResponderEvent) => void;
  size?: 'small' | 'regular';
  o?: boolean;
  circle?: boolean;
  fontSize?: number;
}

const Button = ({
  text = undefined,
  element = undefined,
  onPress,
  size = 'regular',
  o = false,
  style,
  fontSize = undefined,
  circle = false,
  ...props
}: Props): JSX.Element => {
  const buttonStyle = [
    styles.button,
    styles.regular,
    size === 'small' && styles.small,
    o && (size === 'small' ? [styles.o, styles.oSmall] : styles.o)
  ];

  return (
    <Pressable
      style={StyleSheet.flatten(
        !circle
          ? [buttonStyle, style]
          : [
              styles.button,
              {
                width: dpw(0.125),
                height: dpw(0.125),
                borderRadius: dpw(0.125 / 2)
              },
              style
            ]
      )}
      {...props}
      onPress={onPress}
    >
      {text ? (
        <Text
          style={
            size === 'small'
              ? { fontSize: theme.fontSizes.body }
              : { fontSize: theme.fontSizes.subheading }
          }
          weight="bold"
          color={o ? 'primary' : 'secondary'}
        >
          {text}
        </Text>
      ) : (
        element
      )}
    </Pressable>
  );
};

export default Button;
