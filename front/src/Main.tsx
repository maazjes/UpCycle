import { NavigationContainer } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium,
  OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import NotificationModal from 'components/NotificationModal';
import useAuth from 'hooks/useAuth';
import UserTabs from './navigation/UserTabs';
import LoginStack from './navigation/LoginStack';
import { useAppSelector } from './hooks/redux';

SplashScreen.preventAutoHideAsync();

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

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      try {
        const authStorageUser = await refreshLogin();
        handle.current = setInterval(refreshLogin, 3500000);
        if (authStorageUser) {
          setPhotoUrl(authStorageUser.photoUrl);
        }
      } catch {}
      setReady(true);
    };
    initialize();
  }, []);

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready || !fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <>
          {loggedIn ? <UserTabs photoUrl={photoUrl!} /> : <LoginStack />}
          <NotificationModal />
        </>
      </NavigationContainer>
    </View>
  );
};
