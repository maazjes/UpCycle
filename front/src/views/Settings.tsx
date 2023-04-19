import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from 'components/Text';
import Line from 'components/Line';
import useAuth from 'hooks/useAuth';
import { UserScreen } from 'types';
import { dpw } from 'util/helpers';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: dpw(0.033),
    paddingVertical: dpw(0.03),
    alignItems: 'center'
  }
});

const Settings = ({ navigation }: UserScreen<'Settings'>): JSX.Element => {
  const { logout } = useAuth();
  return (
    <View>
      <TouchableOpacity onPress={(): void => navigation.navigate('ChangeEmail')} style={styles.row}>
        <Text size="subheading">Change email</Text>
        <Ionicons name="md-chevron-forward-sharp" size={dpw(0.062)} color="black" />
      </TouchableOpacity>
      <Line />
      <TouchableOpacity
        onPress={(): void => navigation.navigate('ChangePassword')}
        style={styles.row}
      >
        <Text size="subheading">Change password</Text>
        <Ionicons name="md-chevron-forward-sharp" size={dpw(0.062)} color="black" />
      </TouchableOpacity>
      <Line />
      <TouchableOpacity onPress={logout} style={styles.row}>
        <Text size="subheading">Log out</Text>
        <Ionicons name="md-chevron-forward-sharp" size={dpw(0.062)} color="black" />
      </TouchableOpacity>
      <Line />
    </View>
  );
};

export default Settings;
