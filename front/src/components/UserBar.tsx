import {
  View, Pressable, StyleSheet, ViewProps
} from 'react-native';
import { UserBase } from '@shared/types';
import { dph } from 'util/helpers';
import Text from './Text';
import ProfilePhoto from './ProfilePhoto';

const styles = StyleSheet.create({
  userBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  displayName: {
    flexDirection: 'column',
    alignContent: 'space-around'
  },
  profilePhoto: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  extra: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  }
});

interface UserBarProps extends ViewProps {
  user: UserBase;
  itemRight?: JSX.Element;
  profilePhotoSize?: number;
  extra?: JSX.Element;
  extraSecond?: JSX.Element;
  onPress?: () => void;
}

const UserBar = ({
  user, itemRight = undefined, extraSecond = undefined,
  style, profilePhotoSize = 32,
  extra = undefined, onPress = (): null => null
}: UserBarProps): JSX.Element => (
  <Pressable
    style={[styles.userBar, style]}
    onPress={onPress}
  >
    <View style={styles.profilePhoto}>
      <ProfilePhoto
        size={profilePhotoSize}
        uri={user.photoUrl}
      />
      <View style={[styles.displayName, { marginLeft: profilePhotoSize / 3 }]}>
        <Text size="subheading">{user.displayName}</Text>
        <View style={styles.extra}>
          {extra}
          <View style={{ paddingHorizontal: 4 }} />
          {extraSecond}
        </View>
      </View>
    </View>
    {itemRight}
  </Pressable>
);

export default UserBar;
