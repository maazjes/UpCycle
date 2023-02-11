import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from './hooks/redux';
import { TokenUser } from './types';
import UserTabs from './navigation/UserTabs';

export default (): JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  return (
    <NavigationContainer>
      {currentUser ? <UserTabs /> : <UserTabs />}
    </NavigationContainer>
  );
};
