import { NativeRouter } from 'react-router-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium
} from '@expo-google-fonts/open-sans';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import store from './src/util/store';
import Main from './src/Main';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

const authStorage = new AuthStorage();

SplashScreen.preventAutoHideAsync();

const App = (): JSX.Element => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium
  });

  const onLayoutRootView = useCallback(async (): Promise<void> => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  useEffect((): void => {
    if (fontsLoaded) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  if (!appIsReady) {
    return <View />;
  }

  return (
    <NativeRouter>
      <PaperProvider>
        <AuthStorageContext.Provider value={authStorage}>
          <ReduxProvider store={store}>
            <View onLayout={onLayoutRootView}>
              <Main />
            </View>
          </ReduxProvider>
        </AuthStorageContext.Provider>
      </PaperProvider>
    </NativeRouter>
  );
};

export default App;
