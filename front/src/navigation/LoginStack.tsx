import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResetPassword from 'views/ResetPassword';
import { LoginStackParams } from '../types';
import Login from '../views/Login';
import SignUp from '../views/SignUp';

const Stack = createNativeStackNavigator<LoginStackParams>();

const LoginStack = (): JSX.Element => (
  <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ title: 'Log in', headerShown: false }}
    />
    <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign up' }} />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{ title: 'Reset password' }}
    />
  </Stack.Navigator>
);

export default LoginStack;
