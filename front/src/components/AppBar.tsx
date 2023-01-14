import { View, StyleSheet } from 'react-native';
import Menu from './Menu';

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingLeft: 20 / 2,
    backgroundColor: '#24292e',
    paddingBottom: 20,
    flexDirection: 'row'
  },
  link: {
    marginLeft: 7,
    marginRight: 7
  }
});

const AppBar = () => (
  <View style={styles.container}>
    <Menu />
  </View>
);
export default AppBar;
