import { NativeRouter } from 'react-router-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium
} from '@expo-google-fonts/open-sans';
import store from './src/util/store';
import Main from './src/Main';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

const authStorage = new AuthStorage();

const App = (): JSX.Element => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NativeRouter>
      <PaperProvider>
        <AuthStorageContext.Provider value={authStorage}>
          <ReduxProvider store={store}>
            <Main />
          </ReduxProvider>
        </AuthStorageContext.Provider>
      </PaperProvider>
    </NativeRouter>
  );
};

export default App;
