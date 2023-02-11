import { useNavigation } from '@react-navigation/native';
import { LoginStackNavigation, TokenUser } from '../types';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';

const useLogin = (): typeof logIn => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation<LoginStackNavigation>();
  const logIn = async ({ email, password }:
  { email: string; password: string }): Promise<TokenUser> => {
    const response = await loginService.login({ email, password });
    const body = response.data;
    await authStorage.setUser(body);
    api.defaults.headers.common.Authorization = `bearer ${body.token}`;
    dispatch(addUser(body));
    navigate('Home');
    return response.data;
  };
  return logIn;
};

export default useLogin;
