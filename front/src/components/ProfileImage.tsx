import {
  StyleSheet, Image
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  profileImage: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ProfileImage = ({
  uri, size = 30
}: {
  uri: string; size?: number; }):
JSX.Element => (
  uri ? (
    <Image
      style={[styles.profileImage, { borderRadius: size / 2, width: size, height: size }]}
      source={{ uri }}
    />
  ) : <AntDesign style={{ marginTop: 3 }} name="user" size={size - 3} color="white" />
);

export default ProfileImage;
