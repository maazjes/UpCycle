import { View, StyleSheet } from 'react-native';
import Menu from './Menu';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    backgroundColor: '#24292e',
    paddingBottom: 15,
    paddingTop: 28,
    flexDirection: 'row'
  },
  link: {
    marginLeft: 7,
    marginRight: 7
  }
});

const AppBar = (): JSX.Element => (
  <View style={styles.container}>
    <Menu />
  </View>
);
export default AppBar;
