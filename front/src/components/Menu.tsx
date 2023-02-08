import * as React from 'react';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Menu as PaperMenu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import api from '../util/axiosInstance';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { TokenUser } from '../types';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from '../hooks/useAuthStorage';

const Menu = (): JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser => state.user);
  const [visible, setVisible] = React.useState(false);
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(addUser({
      username: '', token: '', name: '', id: -1
    }));
    navigate('/');
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
        anchor={<Pressable onPress={openMenu}><Entypo style={{ marginLeft: 10 }} name="menu" size={35} color="white" /></Pressable>}
      >
        { currentUser.token !== '' ? (
          <>
            <PaperMenu.Item onPress={(): void => navigate('/profile')} title="Your profile" />
            <PaperMenu.Item onPress={(): void => navigate('/new-post')} title="New Post" />
            <PaperMenu.Item onPress={(): void => navigate('/')} title="Front page" />
            <PaperMenu.Item onPress={(): void => navigate(`/favorites/${currentUser.id}`)} title="Favorites" />
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
