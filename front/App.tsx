import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import i18n from 'util/i18n';
import Main from './src/Main';
import store from './src/util/store';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

const authStorage = new AuthStorage();
const initI18n = i18n;

const App = (): JSX.Element => (
  <ReduxProvider store={store}>
    <PaperProvider>
      <AuthStorageContext.Provider value={authStorage}>
        <Main />
      </AuthStorageContext.Provider>
    </PaperProvider>
  </ReduxProvider>
);

export default App;
