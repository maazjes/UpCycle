import { LoginBody, TokenUser } from '@shared/types';
import { setLoggedIn } from 'reducers/loginReducer';
import socket from 'util/socket';
import { refreshIdToken } from 'services/tokens';
import { AuthStorageUser } from 'types';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { setProfileProps } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import { login as serviceLogin } from '../services/login';

const useAuth = (): {
  login: typeof login;
  logout: typeof logout;
  refreshLogin: typeof refreshLogin;
} => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();

  const login = async (loginBody: LoginBody): Promise<TokenUser> => {
    const { data } = await serviceLogin(loginBody);
    const { id, username, photoUrl, refreshToken } = data;
    authStorage.setUser({ id, username, photoUrl, refreshToken });
    api.defaults.headers.common.Authorization = `bearer ${data.idToken}`;
    dispatch(setProfileProps({ id: data.id, username: data.username }));
    dispatch(setLoggedIn(true));
    socket.auth = { userId: data.id };
    socket.connect();
    return data;
  };

  const logout = async (): Promise<void> => {
    authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(setProfileProps(null));
    dispatch(setLoggedIn(false));
    socket.disconnect();
  };

  const refreshLogin = async (): Promise<AuthStorageUser | null> => {
    const user = await authStorage.getUser();
    if (!user) {
      return null;
    }
    const { data } = await refreshIdToken({ refreshToken: user.refreshToken });
    api.defaults.headers.common.Authorization = `bearer ${data.idToken}`;
    dispatch(setProfileProps({ id: user.id, username: user.username }));
    dispatch(setLoggedIn(true));
    socket.auth = { userId: user.id };
    socket.connect();
    return user;
  };

  return { login, logout, refreshLogin };
};

export default useAuth;
