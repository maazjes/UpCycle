import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserStackParams } from '../types';
import SinglePost from '../views/SinglePost';
import Favorites from '../views/Favorites';
import Home from '../views/Home';
import CreatePost from '../views/CreatePost';
import AppBar from '../components/AppBar';
import PublicProfile from '../views/PublicProfile';
import EditPost from '../views/EditPost';

const Stack = createNativeStackNavigator<UserStackParams>();

const UserStack = ({ initialRoute }:
{ initialRoute: keyof UserStackParams }): JSX.Element => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{ header: AppBar }}
  >
    <Stack.Screen name="StackSinglePost" component={SinglePost} />
    <Stack.Screen name="StackFavorites" component={Favorites} />
    <Stack.Screen name="PublicProfile" component={PublicProfile} />
    <Stack.Screen name="StackCreatePost" component={CreatePost} />
    <Stack.Screen name="EditPost" component={EditPost} />
    <Stack.Screen name="StackHome" component={Home} />
  </Stack.Navigator>
);

export default UserStack;
