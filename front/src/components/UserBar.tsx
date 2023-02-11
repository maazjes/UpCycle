import {
  View, Pressable, StyleSheet, ViewProps
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigation, User } from '../types';
import theme from '../styles/theme';
import Text from './Text';
import ProfileImage from './ProfileImage';
import Button from './Button';

const styles = StyleSheet.create({
  userBar: {
    backgroundColor: theme.backgroundColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 17,
    paddingRight: 20
  }
});

interface UserBarProps extends ViewProps {
  user: User;
}

const UserBar = ({
  user, style
}: UserBarProps): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  const onUsernamePress = (): void => {
    navigate('PublicProfile', { userId: user.id });
  };
  return (
    <View style={StyleSheet.flatten([styles.userBar, style])}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ProfileImage size={32} uri={user.photoUrl} userId={user.id} />
        <Pressable
          style={{ marginLeft: 10 }}
          onPress={onUsernamePress}
        >
          <Text style={{ marginBottom: -1 }} fontSize="subheading">{user.displayName}</Text>
          <Text style={{ marginTop: -1 }}>This is the location</Text>
        </Pressable>
      </View>
      <Button style={{ paddingHorizontal: 10, height: 32 }} text="Message" />
    </View>
  );
};

export default UserBar;
