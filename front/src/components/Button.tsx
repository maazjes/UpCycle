import {
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { dpw } from 'util/helpers';
import { ActivityIndicator } from 'react-native-paper';
import Text from './Text';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4ad34a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dpw(0.03)
  },
  regular: {
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
  },
  circle: {
    width: dpw(0.125),
    height: dpw(0.125),
    borderRadius: dpw(0.125 / 2)
  }
});

interface ButtonProps extends TouchableOpacityProps {
  text?: string;
  element?: JSX.Element;
  onPress: (event: GestureResponderEvent | any) => void;
  size?: 'small' | 'regular';
  o?: boolean;
  circle?: boolean;
  fontSize?: number;
  loading?: boolean;
  highlight?: boolean;
}

const Button = ({
  text = undefined,
  element = undefined,
  onPress,
  size = 'regular',
  o = false,
  style,
  circle = false,
  loading = false,
  highlight = true,
  ...props
}: ButtonProps): JSX.Element => {
  const buttonStyle = [
    styles.button,
    size === 'regular' && !circle && styles.regular,
    size === 'small' && !circle && styles.small,
    o && (size === 'small' ? [styles.o, styles.oSmall] : styles.o),
    circle && styles.circle
  ];

  return (
    <TouchableOpacity
      activeOpacity={!highlight ? 1 : undefined}
      style={[buttonStyle, style]}
      {...props}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : text ? (
        <Text
          size={size === 'small' ? 'body' : 'subheading'}
          weight="bold"
          color={o ? 'primary' : 'secondary'}
        >
          {text}
        </Text>
      ) : (
        element
      )}
    </TouchableOpacity>
  );
};

export default Button;
