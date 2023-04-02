import { View, StyleSheet, ViewProps } from 'react-native';
import Text from './Text';

const styles = StyleSheet.create({
  success: {
    color: 'green',
    backgroundColor: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10
  },
  error: {
    color: 'red',
    backgroundColor: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10
  }
});

interface NotificationProps extends ViewProps {
  text: string;
  error?: boolean;
}

const Notification = ({ error, text, ...props }: NotificationProps): JSX.Element | null =>
  text ? (
    <View {...props}>
      <Text style={error ? styles.error : styles.success}>{text}</Text>
    </View>
  ) : null;

export default Notification;
