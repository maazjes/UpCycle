import { View, StyleSheet, ViewProps, TextStyle, TouchableOpacity } from 'react-native';
import { UserBase } from '@shared/types';
import { dpw } from 'util/helpers';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigation } from 'types';
import { useAppSelector } from 'hooks/redux';
import Text from './Text';
import ProfilePhoto from './ProfilePhoto';

const styles = StyleSheet.create({
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profilePhoto: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  extra: {
    flexDirection: 'row',
    marginTop: 'auto'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  }
});

interface UserBarProps extends ViewProps {
  user: UserBase;
  profilePhotoSize?: number;
  extra?: JSX.Element;
  extraSecond?: JSX.Element;
  itemRight?: JSX.Element;
  displayNameStyle?: TextStyle;
  onLongPress?: () => void;
  onPress?: () => void;
}

const UserBar = ({
  user,
  extraSecond = undefined,
  style,
  itemRight = undefined,
  profilePhotoSize = dpw(0.105),
  extra = undefined,
  onPress = undefined,
  displayNameStyle = {},
  onLongPress = undefined
}: UserBarProps): JSX.Element => {
  const { navigate } = useNavigation<UserStackNavigation>();
  const currentUserId = useAppSelector((state): string => state.currentUserId!);

  const onUserBarPress = (): void => {
    if (currentUserId === user.id) {
      navigate('Profile', {
        screen: 'StackProfile',
        params: {
          id: user.id,
          username: user.username
        },
        initial: false
      });
    } else {
      navigate('StackProfile', { id: user.id, username: user.username });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={!onLongPress ? 1 : undefined}
      onLongPress={onLongPress}
      delayLongPress={400}
      style={[styles.userBar, style]}
      onPress={onPress || onUserBarPress}
    >
      <View style={styles.leftContainer}>
        <ProfilePhoto uri={user.photoUrl} size={profilePhotoSize} />
        <View style={{ marginLeft: profilePhotoSize / 2 }}>
          <View style={displayNameStyle}>
            <Text size="subheading">{user.username}</Text>
          </View>
          {(extra || extraSecond) && (
            <View>
              <View style={styles.extra}>
                {extra}
                {extra && extraSecond && <View style={{ paddingHorizontal: dpw(0.008) }} />}
                {extraSecond}
              </View>
            </View>
          )}
        </View>
      </View>
      {itemRight}
    </TouchableOpacity>
  );
};

export default UserBar;
