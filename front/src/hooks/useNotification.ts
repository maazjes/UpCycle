import { NotificationState } from 'types';
import { useAppDispatch } from './redux';
import { addNotification } from '../reducers/notificationReducer';

const useNotification = (): typeof setNotification => {
  const dispatch = useAppDispatch();
  const setNotification = (params: NotificationState): void => {
    dispatch(addNotification(params));
  };
  return setNotification;
};

export default useNotification;
