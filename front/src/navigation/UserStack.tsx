import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserStackParams } from 'types';
import SinglePost from 'views/SinglePost';
import Favorites from 'views/Favorites';
import Home from 'views/Home';
import CreatePost from 'views/CreatePost';
import Profile from 'views/Profile';
import EditPost from 'views/EditPost';
import EditProfile from 'views/EditProfile';
import Chats from 'views/Chats';
import Follows from 'views/Follows';
import SingleChat from 'views/SingleChat';

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
    <Stack.Screen name="StackHome" component={Home} options={{ title: 'Koti' }} />
    <Stack.Screen name="StackFavorites" component={Favorites} options={{ title: 'Suosikit' }} />
    <Stack.Screen name="StackCreatePost" component={CreatePost} options={{ title: 'Uusi ilmoitus' }} />
    <Stack.Screen name="StackChat" component={Chats} options={{ title: 'Viestit' }} />
    <Stack.Screen name="SingleChat" component={SingleChat} />
    <Stack.Screen name="SinglePost" component={SinglePost} options={{ title: 'Ilmoitus' }} />
    <Stack.Screen name="StackProfile" component={Profile} initialParams={profileParams} />
    <Stack.Screen name="EditPost" component={EditPost} options={{ title: 'Muokkaa ilmoitusta' }} />
    <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Muokkaa profiilia' }} />
    <Stack.Screen name="Follows" component={Follows} />
  </Stack.Navigator>
);

export default UserStack;
