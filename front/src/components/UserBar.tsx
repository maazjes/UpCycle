import { View, StyleSheet, ViewProps, TextStyle, TouchableOpacity } from 'react-native';
import { UserBase } from '@shared/types';
import { dph } from 'util/helpers';
import Text from './Text';
import ProfilePhoto from './ProfilePhoto';

const styles = StyleSheet.create({
  userBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
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
  textRight?: string;
  profilePhotoSize?: number;
  extra?: JSX.Element;
  extraSecond?: JSX.Element;
  itemRight?: JSX.Element;
  displayNameStyle?: TextStyle;
  onPress?: () => void;
  onLongPress?: () => void;
}

const UserBar = ({
  user,
  textRight = undefined,
  extraSecond = undefined,
  style,
  itemRight = undefined,
  profilePhotoSize = 32,
  extra = undefined,
  displayNameStyle = {},
  onPress = undefined,
  onLongPress = undefined
}: UserBarProps): JSX.Element => (
  <TouchableOpacity
    activeOpacity={!onLongPress ? 1 : undefined}
    onLongPress={onLongPress}
    delayLongPress={400}
    style={[styles.userBar, style]}
    onPress={onPress}
  >
    <ProfilePhoto uri={user.photoUrl} size={profilePhotoSize} />
    <View style={{ marginLeft: profilePhotoSize / 3, marginRight: 'auto' }}>
      <Text
        style={[extra || extraSecond ? { marginBottom: dph(0.01) } : {}, displayNameStyle]}
        size="subheading"
      >
        {user.username}
      </Text>
      <View style={styles.extra}>
        {extra}
        {extra && extraSecond && <View style={{ paddingHorizontal: 4 }} />}
        {extraSecond}
      </View>
    </View>
    <View>
      <Text
        style={[extra || extraSecond ? { marginBottom: dph(0.01) } : {}, displayNameStyle]}
        color="grey"
      >
        {textRight}
      </Text>
      <Text />
    </View>
    {itemRight}
  </TouchableOpacity>
);

export default UserBar;
