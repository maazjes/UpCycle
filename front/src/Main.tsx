import { NavigationContainer } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium
} from '@expo-google-fonts/open-sans';
import { TokenUser } from '@shared/types';
import NotificationModal from 'components/NotificationModal';
import UserTabs from './navigation/UserTabs';
import LoginStack from './navigation/LoginStack';
import useAuthStorage from './hooks/useAuthStorage';
import { refreshIdToken } from './services/tokens';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { addUser } from './reducers/userReducer';
import socket from './util/socket';
import api from './util/axiosInstance';

SplashScreen.preventAutoHideAsync();

export default (): JSX.Element | null => {
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const ready = useRef(false);
  const handle = useRef<number>();
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium
  });

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      let user = await authStorage.getUser() ?? null;
      let idToken = '';
      if (user) {
        try {
          const { data } = await refreshIdToken(
            { refreshToken: user.refreshToken }
          );
          idToken = data.idToken;
          user = { ...user, idToken };
        } catch (e) {
          ready.current = true;
          dispatch(addUser(null));
          return;
        }

        api.defaults.headers.common.Authorization = `bearer ${idToken}`;
        socket.auth = { userId: user.id };
        socket.connect();

        handle.current = setInterval(async (): Promise<void> => {
          if (user) {
            try {
              const { data } = await refreshIdToken(
                { refreshToken: user.refreshToken }
              );
              const newUser = { ...user, idToken: data.idToken };
              await authStorage.setUser(newUser);
              api.defaults.headers.common.Authorization = `bearer ${data.idToken}`;
              dispatch(addUser(newUser));
            } catch (e) {
              ready.current = true;
              dispatch(addUser(null));
            }
          }
        }, 3500000);
      }
      ready.current = true;
      dispatch(addUser(user));
    };
    initialize();
  }, []);

  useEffect((): void => {
    if (!currentUser) {
      if (socket.active) {
        socket.disconnect();
      }
      if (handle.current) {
        clearInterval(handle.current);
      }
    }
  }, [currentUser, handle.current]);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (ready.current) {
      await SplashScreen.hideAsync();
    }
  }, [ready.current]);

  if (!ready.current || !fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {currentUser ? (
          <>
            <UserTabs profilePhotoUrl={currentUser.photoUrl} />
            <NotificationModal />
          </>
        ) : <LoginStack />}
      </NavigationContainer>
    </View>
  );
};
