import { isAxiosError } from 'axios';
import useNotification from './useNotification';

const useError = (): typeof setError => {
  const notification = useNotification();
  const setError = (error: unknown): void => {
    if (isAxiosError(error)) {
      notification({ message: error.message, error: true });
    }
  };
  return setError;
};

export default useError;
