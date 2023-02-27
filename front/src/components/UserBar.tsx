import {
  View, Pressable, StyleSheet, ViewProps
} from 'react-native';
import { User } from '../types';
import Text from './Text';
import ProfileImage from './ProfileImage';

const styles = StyleSheet.create({
  userBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20
  }
});

interface UserBarProps extends ViewProps {
  user: User;
  itemRight?: JSX.Element;
  profileImageSize?: number;
  extra?: JSX.Element;
  onPress?: () => void;
}

const UserBar = ({
  user, itemRight = undefined, style, profileImageSize = 32,
  extra = undefined, onPress = (): null => null
}: UserBarProps): JSX.Element => (
  <Pressable
    style={[styles.userBar, style]}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ProfileImage
        size={profileImageSize}
        uri={user.photoUrl}
      />
      <View style={{ flexDirection: 'column', marginLeft: profileImageSize / 3 }}>
        <Text fontSize="subheading">{user.displayName}</Text>
        {extra}
      </View>
    </View>
    {itemRight}
  </Pressable>
);

export default UserBar;
