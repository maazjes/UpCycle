import { useNavigate } from 'react-router-native';
import axios from 'axios';
import { useAppDispatch } from './redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';
import { User } from '../types';

const useLogin = (): typeof logIn => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logIn = async ({ username, password }:
  { username: string; password: string }): Promise<User> => {
    const response = await loginService.login(username, password);
    const body = response.data;
    await authStorage.setUser(body);
    axios.defaults.headers.common.Authorization = `bearer ${body.token}`;
    dispatch(addUser(body));
    navigate('/');
    return response.data;
  };
  return logIn;
};

export default useLogin;
