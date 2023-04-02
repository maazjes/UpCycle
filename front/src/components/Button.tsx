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

interface Props extends TouchableOpacityProps {
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
}: Props): JSX.Element => {
  const buttonStyle = [
    styles.button,
    styles.regular,
    size === 'small' && styles.small,
    o && (size === 'small' ? [styles.o, styles.oSmall] : styles.o)
  ];

  return (
    <TouchableOpacity
      activeOpacity={!highlight ? 1 : undefined}
      style={
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
      }
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
