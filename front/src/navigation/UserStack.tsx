import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserStackParams } from 'types';
import SinglePost from 'views/SinglePost';
import Favorites from 'views/Favorites';
import CreatePost from 'views/CreatePost';
import Profile from 'views/Profile';
import EditPost from 'views/EditPost';
import EditProfile from 'views/EditProfile';
import Chats from 'views/Chats';
import Follows from 'views/Follows';
import SingleChat from 'views/SingleChat';
import Search from 'views/Search';
import LightBox from 'views/LightBox';
import Settings from 'views/Settings';
import ChangeEmail from 'views/ChangeEmail';
import ChangePassword from 'views/ChangePassword';

const Stack = createNativeStackNavigator<UserStackParams>();

const UserStack = ({ initialRoute }: { initialRoute: keyof UserStackParams }): JSX.Element => (
  <Stack.Navigator
    initialRouteName={initialRoute}
    screenOptions={{ contentStyle: { backgroundColor: '#FFFFFF' } }}
    id="stack"
  >
    <Stack.Screen name="StackSearch" component={Search} options={{ title: 'Search' }} />
    <Stack.Screen name="StackFavorites" component={Favorites} options={{ title: 'Favorites' }} />
    <Stack.Screen name="StackCreatePost" component={CreatePost} options={{ title: 'New post' }} />
    <Stack.Screen name="StackChats" component={Chats} options={{ title: 'Messages' }} />
    <Stack.Screen name="SingleChat" component={SingleChat} />
    <Stack.Screen name="SinglePost" component={SinglePost} options={{ title: 'Post' }} />
    <Stack.Screen name="StackProfile" component={Profile} />
    <Stack.Screen name="EditPost" component={EditPost} options={{ title: 'Edit post' }} />
    <Stack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ title: 'Muokkaa profiilia' }}
    />
    <Stack.Screen name="Follows" component={Follows} />
    <Stack.Screen name="LightBox" component={LightBox} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
  </Stack.Navigator>
);

export default UserStack;
