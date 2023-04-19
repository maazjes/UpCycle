import { LoginBody, TokenUser } from '@shared/types';
import { setLoggedIn } from 'reducers/loggedIn';
import socket from 'util/socket';
import { refreshIdToken } from 'services/tokens';
import { PartialBy } from 'types';
import { setUser } from 'reducers/profileUser';
import { setChats } from 'reducers/chats';
import { setFavorites } from 'reducers/favorites';
import { setSinglePost } from 'reducers/singlePost';
import { setPosts } from 'reducers/profilePosts';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { setCurrentUserId } from '../reducers/currentUserId';
import useAuthStorage from './useAuthStorage';
import { login as serviceLogin } from '../services/login';

const useAuth = (): {
  login: typeof login;
  logout: typeof logout;
  refreshLogin: typeof refreshLogin;
} => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();

  const logout = (): void => {
    authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(setLoggedIn(false));
    dispatch(setUser(null));
    dispatch(setChats(null));
    dispatch(setCurrentUserId(null));
    dispatch(setFavorites(null));
    dispatch(setSinglePost(null));
    dispatch(setPosts(null));
    socket.disconnect();
  };

  const refreshLogin = async (): Promise<TokenUser | null> => {
    const user = await authStorage.getUser();
    if (!user) {
      return null;
    }
    const { data } = await refreshIdToken({ refreshToken: user.refreshToken });
    api.defaults.headers.common.Authorization = `bearer ${data.idToken}`;
    dispatch(setCurrentUserId(user.id));
    dispatch(setLoggedIn(true));
    socket.auth = { userId: user.id };
    socket.connect();
    return user;
  };

  const login = async (loginBody: LoginBody): Promise<TokenUser> => {
    const { data } = await serviceLogin(loginBody);
    authStorage.setUser(data);
    api.defaults.headers.common.Authorization = `bearer ${data.idToken}`;
    dispatch(setCurrentUserId(data.id));
    dispatch(setLoggedIn(true));
    const newUser: PartialBy<TokenUser, 'idToken' | 'refreshToken'> = { ...data };
    delete newUser.idToken;
    delete newUser.refreshToken;
    socket.auth = { userId: data.id };
    socket.connect();
    return data;
  };

  return { login, logout, refreshLogin };
};

export default useAuth;
