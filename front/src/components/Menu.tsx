import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Menu as PaperMenu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import api from '../util/axiosInstance';
import { useAppDispatch } from '../hooks/redux';
import { addUser } from '../reducers/userReducer';
import useAuthStorage from '../hooks/useAuthStorage';

const Menu = (): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const authStorage = useAuthStorage();
  const dispatch = useAppDispatch();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);

  const logout = async (): Promise<void> => {
    await authStorage.removeUser();
    api.defaults.headers.common.Authorization = undefined;
    dispatch(addUser(null));
  };

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
        anchor={
          <Pressable onPress={openMenu}>
            <Entypo name="menu" size={35} color="black" />
          </Pressable>
        }
      >
        <PaperMenu.Item onPress={logout} title="Logout" />
      </PaperMenu>
    </View>
  );
};

export default Menu;
