import {
  View, Pressable, StyleSheet, ViewProps, Image
} from 'react-native';
import { useNavigate } from 'react-router-native';
import theme from '../styles/theme';
import Text from './Text';

const styles = StyleSheet.create({
  userBar: {
    backgroundColor: theme.backgroundColors.secondary,
    flexDirection: 'row',
    alignItems: 'center'
  },
  userBarItem: {
    margin: 10
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 5,
    marginLeft: 10
  }
});

interface UserBarProps extends ViewProps {
  userId: number;
  username: string;
}

const UserBar = ({
  userId, username, style, ...props
}: UserBarProps): JSX.Element => {
  const navigate = useNavigate();
  const onUsernamePress = (): void => {
    navigate(`/users/${userId}`);
  };
  return (
    <View style={StyleSheet.flatten([styles.userBar, style])}>
      <Image style={styles.profileImage} source={{ uri: 'https://randomi.fi/src/f2bf22133a85d0dffe280ca43f3b17e5.jpg' }} />
      <Pressable
        onPress={onUsernamePress}
        {...props}
      >
        <Text style={styles.userBarItem} fontSize="subheading">{username}</Text>
      </Pressable>
    </View>
  );
};

export default UserBar;
