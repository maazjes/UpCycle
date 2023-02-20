import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserStack from './UserStack';
import { UserStackParams, UserTabsParams } from '../types';

const Tab = createBottomTabNavigator<UserTabsParams>();

const renderUserStack = (initialRoute: keyof UserStackParams):
() => JSX.Element => (
  (): JSX.Element => <UserStack initialRoute={initialRoute} />
);

const UserTabs = (): JSX.Element => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    unmountOnBlur: true
  }}
  >
    <Tab.Screen name="Home" component={renderUserStack('StackHome')} />
    <Tab.Screen name="Favorites" component={renderUserStack('StackFavorites')} />
    <Tab.Screen name="CreatePost" component={renderUserStack('StackCreatePost')} />
    <Tab.Screen name="Profile" component={renderUserStack('StackProfile')} />
    <Tab.Screen name="Chat" component={renderUserStack('StackChat')} />
  </Tab.Navigator>
);

export default UserTabs;
