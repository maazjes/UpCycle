import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ResetPassword from 'views/ResetPassword';
import VerifyEmail from 'views/VerifyEmail';
import AddPhoto from 'views/AddPhoto';
import { LoginStackParams } from '../types';
import Login from '../views/Login';
import AddInformation from '../views/AddInformation';

const Stack = createNativeStackNavigator<LoginStackParams>();

const LoginStack = (): JSX.Element => (
  <Stack.Navigator screenOptions={{ contentStyle: { backgroundColor: 'white' } }}>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ title: 'Log in', headerShown: false }}
    />
    <Stack.Screen name="VerifyEmail" component={VerifyEmail} options={{ title: 'Sign up' }} />
    <Stack.Screen name="AddInformation" component={AddInformation} options={{ title: 'Sign up' }} />
    <Stack.Screen name="AddPhoto" component={AddPhoto} options={{ title: 'Sign up' }} />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{ title: 'Reset password' }}
    />
  </Stack.Navigator>
);

export default LoginStack;
