import {
  View, Pressable, StyleSheet, ViewProps
} from 'react-native';
import { User } from '../types';
import Text from './Text';
import ProfilePhoto from './ProfilePhoto';

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
  profilePhotoSize?: number;
  extra?: JSX.Element;
  onPress?: () => void;
}

const UserBar = ({
  user, itemRight = undefined, style, profilePhotoSize = 32,
  extra = undefined, onPress = (): null => null
}: UserBarProps): JSX.Element => (
  <Pressable
    style={[styles.userBar, style]}
    onPress={onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ProfilePhoto
        size={profilePhotoSize}
        uri={user.photoUrl}
      />
      <View style={{ flexDirection: 'column', marginLeft: profilePhotoSize / 3 }}>
        <Text fontSize="subheading">{user.displayName}</Text>
        {extra}
      </View>
    </View>
    {itemRight}
  </Pressable>
);

export default UserBar;
