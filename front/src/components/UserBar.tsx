import {
  View, Pressable, StyleSheet, ViewProps
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigation, User } from '../types';
import theme from '../styles/theme';
import Text from './Text';
import ProfileImage from './ProfileImage';

const styles = StyleSheet.create({
  userBar: {
    backgroundColor: theme.backgroundColors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20
  }
});

interface UserBarProps extends ViewProps {
  user: User;
  itemRight: JSX.Element;
  profileImageSize?: number;
}

const UserBar = ({
  user, itemRight, style, profileImageSize = 32
}: UserBarProps): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  const onUsernamePress = (): void => {
    navigate('StackProfile', { userId: user.id, displayName: user.displayName });
  };
  return (
    <View style={StyleSheet.flatten([styles.userBar, style])}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ProfileImage
          size={profileImageSize}
          uri={user.photoUrl}
          userId={user.id}
          displayName={user.displayName}
        />
        <Pressable
          style={{ marginLeft: profileImageSize / 4 }}
          onPress={onUsernamePress}
        >
          <Text style={{ marginBottom: -1 }} fontSize="subheading">{user.displayName}</Text>
          <Text style={{ marginTop: -1 }}>This is the location</Text>
        </Pressable>
      </View>
      {itemRight}
    </View>
  );
};

export default UserBar;
