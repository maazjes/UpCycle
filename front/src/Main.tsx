import { NavigationContainer } from '@react-navigation/native';
import { useCallback, useEffect, useState, useRef } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import useAuth from 'hooks/useAuth';
import { createURL } from 'expo-linking';
import UserTabs from './navigation/UserTabs';
import LoginStack from './navigation/LoginStack';
import { useAppSelector } from './hooks/redux';

SplashScreen.preventAutoHideAsync();

const config = {
  screens: {
    Login: 'login',
    VerifyEmail: 'verifyemail',
    ChangeEmail: 'changeemail'
  }
};

const prefix = createURL('/');

export default (): JSX.Element | null => {
  const loggedIn = useAppSelector((state): boolean => state.loggedIn);
  const { refreshLogin } = useAuth();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const handle = useRef<NodeJS.Timer>();
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_700Bold
  });
  const linking = {
    prefixes: [prefix],
    config
  };

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      try {
        const authStorageUser = await refreshLogin();
        if (authStorageUser) {
          setPhotoUrl(authStorageUser.photoUrl);
        }
      } catch {}
      setReady(true);
    };
    initialize();
  }, [loggedIn]);

  useEffect((): void => {
    if (loggedIn) {
      handle.current = setInterval(refreshLogin, 3500000);
    }
    if (handle.current && !loggedIn) {
      clearInterval(handle.current);
    }
  }, [loggedIn]);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready || !fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer linking={linking}>
        {loggedIn ? <UserTabs photoUrl={photoUrl!} /> : <LoginStack />}
      </NavigationContainer>
    </View>
  );
};
