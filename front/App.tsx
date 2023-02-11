import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import {
  useFonts,
  OpenSans_400Regular,
  OpenSans_500Medium
} from '@expo-google-fonts/open-sans';
import { View } from 'react-native';
import Main from './src/Main';
import store from './src/util/store';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';
import Notification from './src/components/Notification';

const authStorage = new AuthStorage();

const App = (): JSX.Element => {
  const [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_500Medium
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <AuthStorageContext.Provider value={authStorage}>
          <Notification />
          <Main />
        </AuthStorageContext.Provider>
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
