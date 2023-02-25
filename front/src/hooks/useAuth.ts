import { TokenUser } from '../types';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';
import useRefreshToken from './useRefreshToken';

const useAuth = (): { login: typeof login; logout: typeof logout } => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const [setRefresh, clearRefresh] = useRefreshToken();

  const login = async ({ email, password }:
  { email: string; password: string; first?: boolean }): Promise<TokenUser> => {
    const response = await loginService.login({ email, password });
    setRefresh();
    const body = response.data;
    await authStorage.setUser(body);
    api.defaults.headers.common.Authorization = `bearer ${body.token}`;
    dispatch(addUser(body));
    return response.data;
  };

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    clearRefresh();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(addUser(null));
  };

  return { login, logout };
};

export default useAuth;
