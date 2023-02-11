import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginStackParams } from '../types';
import Login from '../views/Login';
import SignUp from '../views/SignUp';
import UserTabs from './UserTabs';

const Stack = createNativeStackNavigator<LoginStackParams>();

const LoginStack = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="Home" component={UserTabs} />
  </Stack.Navigator>
);

export default LoginStack;
