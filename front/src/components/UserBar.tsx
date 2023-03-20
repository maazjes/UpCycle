import { View, Pressable, StyleSheet, ViewProps, TextStyle } from 'react-native';
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
  onPress?: () => void;
  displayNameStyle?: TextStyle;
}

const UserBar = ({
  user,
  textRight = undefined,
  extraSecond = undefined,
  style,
  profilePhotoSize = 32,
  extra = undefined,
  onPress = (): null => null,
  displayNameStyle = {}
}: UserBarProps): JSX.Element => (
  <Pressable style={[styles.userBar, style]} onPress={onPress}>
    <ProfilePhoto size={profilePhotoSize} uri={user.photoUrl} />
    <View style={{ marginLeft: profilePhotoSize / 3, marginRight: 'auto' }}>
      <Text
        style={[extra || extraSecond ? { marginBottom: dph(0.01) } : {}, displayNameStyle]}
        size="subheading"
      >
        {user.displayName}
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
  </Pressable>
);

export default UserBar;
