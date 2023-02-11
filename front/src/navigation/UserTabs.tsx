import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Menu from '../components/Menu';
import UserStack from './UserStack';
import { UserStackParams, UserTabsParams } from '../types';

const Tab = createBottomTabNavigator<UserTabsParams>();

const renderMenu = (): JSX.Element => <Menu />;

const renderUserStack = (initialRoute: keyof UserStackParams): () => JSX.Element => (
  (): JSX.Element => <UserStack initialRoute={initialRoute} />
);

const UserTabs = (): JSX.Element => (
  <Tab.Navigator screenOptions={{
    headerRight: renderMenu,
    headerRightContainerStyle: { marginRight: 10 },
    headerShown: false,
    unmountOnBlur: true
  }}
  >
    <Tab.Screen name="Home" component={renderUserStack('StackHome')} />
    <Tab.Screen name="Favorites" component={renderUserStack('StackFavorites')} />
    <Tab.Screen name="CreatePost" component={renderUserStack('StackCreatePost')} />
    <Tab.Screen
      name="PrivateProfile"
      component={renderUserStack('StackPrivateProfile')}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

export default UserTabs;
