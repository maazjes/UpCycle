import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserStackParams } from '../types';
import SinglePost from '../views/SinglePost';
import Favorites from '../views/Favorites';
import Home from '../views/Home';
import CreatePost from '../views/CreatePost';
import Profile from '../views/Profile';
import EditPost from '../views/EditPost';
import EditProfile from '../views/EditProfile';
import Chats from '../views/Chats';
import SingleChat from '../views/SingleChat';

const Stack = createNativeStackNavigator<UserStackParams>();

const UserStack = ({ initialRoute, profileParams = undefined }:
{ initialRoute: keyof UserStackParams;
  profileParams?: { userId: string; username: string }; })
: JSX.Element => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}
    id="stack"
  >
    <Stack.Screen name="StackHome" component={Home} options={{ title: 'Home' }} />
    <Stack.Screen name="StackFavorites" component={Favorites} options={{ title: 'Favorites' }} />
    <Stack.Screen name="StackCreatePost" component={CreatePost} options={{ title: 'Create new listing' }} />
    <Stack.Screen name="StackChat" component={Chats} options={{ title: 'Messages' }} />
    <Stack.Screen name="SingleChat" component={SingleChat} />
    <Stack.Screen name="SinglePost" component={SinglePost} options={{ title: 'Post' }} />
    <Stack.Screen name="StackProfile" component={Profile} options={{ title: 'Profile' }} initialParams={profileParams} />
    <Stack.Screen name="EditPost" component={EditPost} />
    <Stack.Screen name="EditProfile" component={EditProfile} />
  </Stack.Navigator>
);

export default UserStack;
