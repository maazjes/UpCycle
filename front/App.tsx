import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-native-paper';
import Main from './src/Main';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';

const authStorage = new AuthStorage();

const App = (): JSX.Element => (
  <NativeRouter>
    <Provider>
      <AuthStorageContext.Provider value={authStorage}>
        <Main />
      </AuthStorageContext.Provider>
    </Provider>
  </NativeRouter>
);

export default App;
