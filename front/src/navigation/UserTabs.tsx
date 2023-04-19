import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, Feather } from '@expo/vector-icons';
import { dpw } from 'util/helpers';
import ProfilePhoto from '../components/ProfilePhoto';
import UserStack from './UserStack';
import { UserStackParams, UserTabsParams } from '../types';

interface Info {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator<UserTabsParams>();

const renderUserStack =
  (initialRoute: keyof UserStackParams): (() => JSX.Element) =>
  (): JSX.Element =>
    <UserStack initialRoute={initialRoute} />;

const UserTabs = ({ photoUrl }: { photoUrl: string }): JSX.Element => {
  const homeIcon = (info: Info): JSX.Element => (
    <Entypo name="home" size={dpw(0.085)} color={info.focused ? '#7bc17e' : 'black'} />
  );
  const favoritesIcon = (info: Info): JSX.Element => (
    <Feather name="heart" size={dpw(0.085)} color={info.focused ? '#7bc17e' : 'black'} />
  );
  const createPostIcon = (info: Info): JSX.Element => (
    <Feather name="plus-square" size={dpw(0.087)} color={info.focused ? '#7bc17e' : 'black'} />
  );
  const chatIcon = (info: Info): JSX.Element => (
    <Feather name="message-circle" size={dpw(0.085)} color={info.focused ? '#7bc17e' : 'black'} />
  );
  const profileIcon = (): JSX.Element => <ProfilePhoto uri={photoUrl} size={dpw(0.085)} />;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { display: 'none' },
        tabBarIconStyle: { alignSelf: 'center' },
        tabBarStyle: { height: dpw(0.13) }
      }}
    >
      <Tab.Screen
        name="Search"
        component={renderUserStack('StackSearch')}
        options={{
          tabBarIcon: homeIcon,
          unmountOnBlur: true
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={renderUserStack('StackFavorites')}
        options={{
          tabBarIcon: favoritesIcon
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={renderUserStack('StackCreatePost')}
        options={{
          tabBarIcon: createPostIcon
        }}
      />
      <Tab.Screen
        name="Chats"
        component={renderUserStack('StackChats')}
        options={{ tabBarIcon: chatIcon, lazy: false }}
      />
      <Tab.Screen
        name="Profile"
        component={renderUserStack('StackProfile')}
        options={{
          tabBarIcon: profileIcon,
          lazy: false
        }}
      />
    </Tab.Navigator>
  );
};

export default UserTabs;
