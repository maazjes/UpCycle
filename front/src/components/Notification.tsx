import { View, StyleSheet, Text } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { NotificationState } from '../types';

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 15
  },
  success: {
    color: 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  error: {
    color: 'red',
    backgroundColor: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
});

const Notification = (): JSX.Element => {
  const notificationState = useAppSelector((state): NotificationState => state.notification);
  const { message, error } = notificationState;
  if (message === '') {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <Text style={error ? styles.error : styles.success}>
        {message}
      </Text>
    </View>
  );
};

export default Notification;
