import { StyleSheet } from 'react-native';
import { useAppSelector } from '../hooks/redux';
import { NotificationState } from '../types';

const style = StyleSheet.create({
  success: {
    color: 'green',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: '10',
    marginBottom: '10'
  },
  error: {
    color: 'red',
    backgroundColor: 'grey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: '10',
    marginBottom: '10'
  }
});

const Notification = (): JSX.Element | null => {
  const notificationState = useAppSelector((state): NotificationState => state.notification);
  const { message, error } = notificationState;
  if (message === '') {
    return null;
  }
  return (
    <div style={error ? style.error : style.success}>
      {message}
    </div>
  );
};

export default Notification;
