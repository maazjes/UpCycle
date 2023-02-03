import {
  StyleSheet, Image, ImageStyle, Pressable
} from 'react-native';
import { useNavigate } from 'react-router-native';

const styles = StyleSheet.create({
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 25
  }
});

const ProfileImage = ({ userId, imageStyle = {} }: {
  userId: number; imageStyle?: ImageStyle; }): JSX.Element => {
  const navigate = useNavigate();
  const onProfileImagePress = (): void => {
    navigate(`/users/${userId}`);
  };
  return (
    <Pressable
      onPress={onProfileImagePress}
    >
      <Image
        style={[styles.profileImage, imageStyle]}
        source={{ uri: 'https://randomi.fi/src/f2bf22133a85d0dffe280ca43f3b17e5.jpg' }}
      />
    </Pressable>
  );
};

export default ProfileImage;
