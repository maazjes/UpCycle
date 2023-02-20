import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import UserTabs from './navigation/UserTabs';
import LoginStack from './navigation/LoginStack';
import useAuthStorage from './hooks/useAuthStorage';
import { TokenUser } from './types';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { addUser } from './reducers/userReducer';

export default (): JSX.Element => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  useEffect((): void => {
    const getUser = async (): Promise<void> => {
      const user = await authStorage.getUser();

      dispatch(addUser(user));
    };
    getUser();
  }, []);
  return (
    <NavigationContainer>
      {currentUser ? <UserTabs /> : <LoginStack />}
    </NavigationContainer>
  );
};
