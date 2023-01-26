import { useAppDispatch } from './redux';
import { setTimedNotification } from '../reducers/notificationReducer';

const useNotification = (): typeof setNotification => {
  const dispatch = useAppDispatch();
  const setNotification = (message: string, error: boolean): void => {
    dispatch(setTimedNotification(message, error));
  };
  return setNotification;
};

export default useNotification;
