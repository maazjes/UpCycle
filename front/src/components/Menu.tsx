import * as React from 'react';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Menu as PaperMenu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../util/axiosInstance';
import { useAppDispatch, useAppSelector } from '../hooks/redux';

import { TokenUser } from '../types';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from '../hooks/useAuthStorage';

const Menu = (): JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const [visible, setVisible] = React.useState(false);
  const { navigate } = useNavigation();
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(addUser({
      token: '', email: '', id: -1
    }));
    navigate('home');
  };

  useEffect((): void => {
    const getToken = async (): Promise<void> => {
      const user = await authStorage.getUser();
      if (user) {
        dispatch(addUser(user));
        api.defaults.headers.common.Authorization = `bearer ${user.token}`;
      }
    };
    getToken();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <PaperMenu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Pressable onPress={openMenu}><Entypo name="menu" size={35} color="black" /></Pressable>}
      >
        { currentUser?.token !== '' ? (
          <PaperMenu.Item onPress={logout} title="Logout" />
        ) : (
          <>
            <PaperMenu.Item onPress={(): void => navigate('/login')} title="Login" />
            <PaperMenu.Item onPress={(): void => navigate('/register')} title="Register" />
          </>
        )}
      </PaperMenu>
    </View>
  );
};

export default Menu;
