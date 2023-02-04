import { isAxiosError } from 'axios';
import useNotification from './useNotification';

const useError = (): typeof setError => {
  const notification = useNotification();
  const setError = (error: unknown): void => {
    console.log(error);
    if (isAxiosError(error)) {
      notification(error.message, true);
    }
  };
  return setError;
};

export default useError;
