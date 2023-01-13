import Main from './src/Main';
import { NativeRouter } from 'react-router-native';
import { Provider } from 'react-native-paper';

const App = () => {
  return (
    <>
      <NativeRouter>
        <Provider>
          <Main />
        </Provider>
      </NativeRouter>
    </>
  );
};

export default App;
