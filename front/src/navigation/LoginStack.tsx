import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginStackParams } from '../types';
import Login from '../views/Login';
import SignUp from '../views/SignUp';

const Stack = createNativeStackNavigator<LoginStackParams>();

const LoginStack = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} options={{ title: 'Log in      ' }} />
    <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign up' }} />
  </Stack.Navigator>
);

export default LoginStack;
