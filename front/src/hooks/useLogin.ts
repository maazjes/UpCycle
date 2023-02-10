import { useNavigate } from 'react-router-native';
import api from '../util/axiosInstance';
import { useAppDispatch } from './redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';
import { TokenUser } from '../types';

const useLogin = (): typeof logIn => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logIn = async ({ email, password }:
  { email: string; password: string }): Promise<TokenUser> => {
    const response = await loginService.login({ email, password });
    const body = response.data;
    await authStorage.setUser(body);
    api.defaults.headers.common.Authorization = `bearer ${body.token}`;
    dispatch(addUser(body));
    navigate('/');
    return response.data;
  };
  return logIn;
};

export default useLogin;
