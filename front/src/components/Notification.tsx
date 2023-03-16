import {
  View, StyleSheet, Text, ViewProps
} from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { NotificationState } from '../types';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
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

const Notification = (props: ViewProps): JSX.Element => {
  const notification = useAppSelector((state): NotificationState => state.notification);
  const { message, error, modal } = notification;

  if (!message || modal) {
    return <View />;
  }

  return (
    <View style={styles.container} {...props}>
      <Text style={error ? styles.error : styles.success}>
        {message}
      </Text>
    </View>
  );
};

export default Notification;
