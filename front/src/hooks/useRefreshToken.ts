import { useState } from 'react';
import tokensService from '../services/tokens';

const useRefreshToken = (): [typeof setRefresh, typeof clearRefresh] => {
  const [handle, setHandle] = useState<number>();

  const setRefresh = (): void => {
    const newHandle = setInterval((): void => {
      tokensService.refreshToken();
    }, 3600000);
    setHandle(newHandle);
  };

  const clearRefresh = (): void => {
    if (handle) {
      clearInterval(handle);
    }
  };
  return [setRefresh, clearRefresh];
};

export default useRefreshToken;
