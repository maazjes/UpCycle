import * as React from 'react';
import { View } from 'react-native';
import { Navigate } from 'react-router-native';
import { Button, Menu as PaperMenu, Divider } from 'react-native-paper';

const Menu = () => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View
      style={{
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <PaperMenu visible={visible} onDismiss={closeMenu} anchor={<Button onPress={openMenu}>Show menu</Button>}>
        <PaperMenu.Item onPress={() => <Navigate to="/profile" replace />} title="Your profile" />
        <PaperMenu.Item onPress={() => {}} title="Item 2" />
        <Divider />
        <PaperMenu.Item onPress={() => {}} title="Item 3" />
      </PaperMenu>
    </View>
  );
};

export default Menu;
