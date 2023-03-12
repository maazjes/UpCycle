import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Entypo, AntDesign, FontAwesome, Feather
} from '@expo/vector-icons';
import ProfilePhoto from '../components/ProfilePhoto';
import UserStack from './UserStack';
import { UserStackParams, UserTabsParams } from '../types';

interface Info {
  focused: boolean;
  color: string;
  size: number;
}

const Tab = createBottomTabNavigator<UserTabsParams>();

const renderUserStack = (
  initialRoute: keyof UserStackParams
): () => JSX.Element => (
  (): JSX.Element => <UserStack initialRoute={initialRoute} />
);

const UserTabs = ({ profilePhotoUrl }: { profilePhotoUrl: string }): JSX.Element => {
  const homeIcon = (info: Info): JSX.Element => <Entypo name="home" size={30} color={info.focused ? '#7bc17e' : 'black'} />;
  const favoritesIcon = (info: Info): JSX.Element => <AntDesign name="hearto" size={26} color={info.focused ? '#7bc17e' : 'black'} />;
  const createPostIcon = (info: Info): JSX.Element => <FontAwesome name="plus-square-o" size={30} color={info.focused ? '#7bc17e' : 'black'} />;
  const chatIcon = (info: Info): JSX.Element => <Feather name="message-circle" size={28} color={info.focused ? '#7bc17e' : 'black'} />;
  const profileIcon = (): JSX.Element => <ProfilePhoto uri={profilePhotoUrl} size={28} />;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        unmountOnBlur: true,
        tabBarLabelStyle: { display: 'none' },
        tabBarIconStyle: { alignSelf: 'center' }
      }}
    >
      <Tab.Screen
        name="Search"
        component={renderUserStack('StackSearch')}
        options={{
          tabBarIcon: homeIcon
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
        options={{ tabBarIcon: createPostIcon, tabBarIconStyle: { marginTop: 2 } }}
      />
      <Tab.Screen
        name="Chat"
        component={renderUserStack('StackChat')}
        options={{ tabBarIcon: chatIcon }}
      />
      <Tab.Screen
        name="Profile"
        component={renderUserStack('StackProfile')}
        options={{ tabBarIcon: profileIcon }}
      />
    </Tab.Navigator>
  );
};

export default UserTabs;
