import { TokenUser } from '../types';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';

const useAuth = (): { login: typeof login; logout: typeof logout } => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();

  const login = async ({ email, password }:
  { email: string; password: string }): Promise<TokenUser> => {
    const response = await loginService.login({ email, password });
    const body = response.data;
    await authStorage.setUser(body);
    api.defaults.headers.common.Authorization = `bearer ${body.token}`;
    dispatch(addUser(body));
    return response.data;
  };

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(addUser(null));
  };

  return { login, logout };
};

export default useAuth;
