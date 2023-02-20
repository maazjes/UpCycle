import {
  StyleSheet, Image, Pressable
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserStackNavigation } from '../types';

const styles = StyleSheet.create({
  profileImage: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ProfileImage = ({
  userId, displayName, uri, size = 30
}: {
  userId: string; displayName: string; uri: string; size?: number; }):
JSX.Element => {
  const navigation = useNavigation<UserStackNavigation>();
  const onProfileImagePress = (): void => {
    navigation.navigate('StackProfile', { userId, displayName });
  };
  return (
    <Pressable
      onPress={onProfileImagePress}
      style={[styles.profileImage, { borderRadius: size / 2, width: size, height: size }]}
    >
      {uri ? (
        <Image
          style={[styles.profileImage, { borderRadius: size / 2, width: size, height: size }]}
          source={{ uri }}
        />
      ) : <AntDesign style={{ marginTop: 3 }} name="user" size={size - 3} color="white" />}
    </Pressable>
  );
};

export default ProfileImage;
