import { TokenUser } from '@shared/types';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';

const useAuth = (): { login: typeof login; logout: typeof logout } => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();

  const login = async ({ email, password }:
  { email: string; password: string; first?: boolean }): Promise<TokenUser> => {
    const { data } = await loginService.login({ email, password });
    await authStorage.setUser(data);
    api.defaults.headers.common.Authorization = `bearer ${data.idToken}`;
    dispatch(addUser(data));
    return data;
  };

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(addUser(null));
  };

  return { login, logout };
};

export default useAuth;
