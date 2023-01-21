import * as React from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Button, Menu as PaperMenu } from 'react-native-paper';
import axios from 'axios';
import useAuthStorage from '../hooks/useAuthStorage';

const Menu = (): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const authStorage = useAuthStorage();
  const navigate = useNavigate();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);

  const logout = async (): Promise<void> => {
    await authStorage.removeAccessToken();
    axios.defaults.headers.common.Authorization = undefined;
  };

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
        anchor={<Button onPress={openMenu}>Show menu</Button>}
      >
        { axios.defaults.headers.common.Authorization ? (
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
          </>
        )}
      </PaperMenu>
    </View>
  );
};

export default Menu;
