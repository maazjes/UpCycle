import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { User } from '@shared/types';
import { UserStackNavigation } from '../../types';
import useAuth from '../../hooks/useAuth';

const ProfileOptions = ({ user }: {
  user: User; }): JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const { navigate } = useNavigation<UserStackNavigation>();
  const { logout } = useAuth();
  const openMenu = (): void => setVisible(true);
  const closeMenu = (): void => setVisible(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<Pressable onPress={openMenu}><Ionicons name="settings-outline" size={28} color="black" /></Pressable>}
      >
        <Menu.Item onPress={(): void => navigate('EditProfile', user)} title="Edit profile" />
        <Menu.Item onPress={logout} title="Log out" />
      </Menu>
    </View>
  );
};

export default ProfileOptions;
