import * as React from 'react';
import { View } from 'react-native';
import { Navigate } from 'react-router-native';
import { Button, Menu as PaperMenu } from 'react-native-paper';

const Menu = () => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const onProfileClick = () => <Navigate to="/profile" replace />;
  const onNewPostClick = () => <Navigate to="/profile" replace />;
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
