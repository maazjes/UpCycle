import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { UserBase } from '@shared';
import Main from './src/Main';
import store from './src/util/store';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

const authStorage = new AuthStorage();

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
