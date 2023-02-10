import {
  StyleSheet, Image, ImageStyle, Pressable
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  profileImage: {
    borderRadius: 25,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ProfileImage = ({ userId, uri, size = 30 }: {
  userId: number; uri: string; size?: number; }): JSX.Element => {
  const navigate = useNavigate();
  const onProfileImagePress = (): void => {
    navigate(`/users/${userId}`);
  };
  return (
    <Pressable
      onPress={onProfileImagePress}
      style={[styles.profileImage, { width: size, height: size }]}
    >
      {uri ? (
        <Image
          style={[styles.profileImage, { width: size, height: size }]}
          source={{ uri }}
        />
      ) : <AntDesign style={{ marginTop: 3 }} name="user" size={size - 3} color="white" />}
    </Pressable>
  );
};

export default ProfileImage;
