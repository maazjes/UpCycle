import { NativeRouter } from 'react-router-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Main from './src/Main';
import AuthStorage from './src/util/authStorage';
import AuthStorageContext from './src/contexts/AuthStorageContext';
import userReducer from './reducers/userReducer';

const store = configureStore({ reducer: { user: userReducer } });

const authStorage = new AuthStorage();

const App = (): JSX.Element => (
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

export default App;
