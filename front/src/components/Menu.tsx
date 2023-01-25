import * as React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Button, Menu as PaperMenu } from 'react-native-paper';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { User } from '../types';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from '../hooks/useAuthStorage';
import Text from './Text';

const Menu = (): JSX.Element => {
  const currentUser = useAppSelector((state): User => state.user);
  const [visible, setVisible] = React.useState(false);
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    axios.defaults.headers.common.Authorization = undefined;
    dispatch(addUser({
      username: '', token: '', name: '', id: -1
    }));
  };

  useEffect((): void => {
    const getToken = async (): Promise<void> => {
      const user = await authStorage.getUser();
      if (user) {
        dispatch(addUser(user));
        axios.defaults.headers.common.Authorization = `bearer ${user.token}`;
      }
    };
    getToken();
  }, []);

  return (
    <View
      style={{
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <PaperMenu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Button onPress={openMenu}><Text color="textSecondary">Show menu</Text></Button>}
      >
        { currentUser.token !== '' ? (
          <>
            <PaperMenu.Item onPress={(): void => navigate('/profile')} title="Your profile" />
            <PaperMenu.Item onPress={(): void => navigate('/new-post')} title="New Post" />
            <PaperMenu.Item onPress={(): void => navigate('/')} title="Front page" />
            <PaperMenu.Item onPress={logout} title="Logout" />
          </>
        ) : (
          <>
            <PaperMenu.Item onPress={(): void => navigate('/')} title="Front page" />
            <PaperMenu.Item onPress={(): void => navigate('/login')} title="Login" />
            <PaperMenu.Item onPress={(): void => navigate('/register')} title="Register" />
          </>
        )}
      </PaperMenu>
    </View>
  );
};

export default Menu;
