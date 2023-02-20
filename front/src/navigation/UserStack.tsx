import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TokenUser, UserStackParams } from '../types';
import SinglePost from '../views/SinglePost';
import Favorites from '../views/Favorites';
import Home from '../views/Home';
import CreatePost from '../views/CreatePost';
import Profile from '../views/Profile';
import EditPost from '../views/EditPost';
import EditProfile from '../views/EditProfile';
import Chat from '../views/Chat';
import { useAppSelector } from '../hooks/redux';

const Stack = createNativeStackNavigator<UserStackParams>();

const UserStack = ({ initialRoute }:
{ initialRoute: keyof UserStackParams })
: JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const ProfileParams = { userId: currentUser?.id, displayName: currentUser?.displayName };
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}
    >
      <Stack.Screen name="StackHome" component={Home} options={{ title: 'Home' }} />
      <Stack.Screen name="StackFavorites" component={Favorites} options={{ title: 'Favorites' }} />
      <Stack.Screen name="StackCreatePost" component={CreatePost} options={{ title: 'Create post' }} />
      <Stack.Screen name="StackChat" component={Chat} options={{ title: 'Chats' }} />
      <Stack.Screen name="SinglePost" component={SinglePost} options={{ title: 'Post' }} />
      <Stack.Screen name="StackProfile" component={Profile} options={{ title: 'Profile' }} initialParams={ProfileParams} />
      <Stack.Screen name="EditPost" component={EditPost} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default UserStack;
