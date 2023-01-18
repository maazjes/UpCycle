import * as React from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Button, Menu as PaperMenu } from 'react-native-paper';

const Menu = () => {
  const [visible, setVisible] = React.useState(false);
  const navigate = useNavigate();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const onProfileClick = () => navigate('/profile');
  const onNewPostClick = () => navigate('/new-post');
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
        <PaperMenu.Item onPress={onProfileClick} title="Your profile" />
        <PaperMenu.Item onPress={onNewPostClick} title="New Post" />
        <PaperMenu.Item onPress={() => {}} title="Item 3" />
      </PaperMenu>
    </View>
  );
};

export default Menu;
