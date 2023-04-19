import { View, StyleSheet, ViewProps } from 'react-native';
import { dpw } from 'util/helpers';
import Text from './Text';

const styles = StyleSheet.create({
  successText: {
    color: 'green',
    backgroundColor: 'lightgrey',
    padding: dpw(0.028)
  },
  errorText: {
    color: 'red',
    backgroundColor: 'lightgrey',
    padding: dpw(0.028)
  }
});

interface NotificationProps extends ViewProps {
  text: string;
  error?: boolean;
}

const Notification = ({ error, text, ...props }: NotificationProps): JSX.Element | null =>
  text ? (
    <View {...props}>
      <Text style={error ? styles.errorText : styles.successText}>{text}</Text>
    </View>
  ) : null;

export default Notification;
