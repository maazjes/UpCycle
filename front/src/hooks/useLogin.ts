import { useNavigate } from 'react-router-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from './useAuthStorage';
import loginService from '../services/login';

const useLogin = (): Function => {
  const authStorage = useAuthStorage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logIn = async ({ username, password }:
  { username: string; password: string }): Promise<{ token: string }> => {
    const response = await loginService.login(username, password);
    const body = response.data;
    await authStorage.setUser(body);
    axios.defaults.headers.common.Authorization = `bearer ${body.token}`;
    dispatch(addUser({ username: body.username, token: body.token }));
    navigate('/');
    return response.data;
  };
  return logIn;
};

export default useLogin;
