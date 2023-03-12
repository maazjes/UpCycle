import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Menu } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EmailUser } from '@shared/types';
import Button from 'components/Button';
import { UserStackNavigation } from '../../types';
import useAuth from '../../hooks/useAuth';

const ProfileOptions = ({ user }: {
  user: EmailUser; }): JSX.Element => {
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
        anchor={<Button text="options" size="small" onPress={openMenu} />}
      >
        <Menu.Item onPress={(): void => navigate('EditProfile', user)} title="Edit profile" />
        <Menu.Item onPress={logout} title="Log out" />
      </Menu>
    </View>
  );
};

export default ProfileOptions;
