import {
  StyleSheet, Image
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  profilePhoto: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ProfilePhoto = ({
  uri, size = 30
}: {
  uri: string | null; size?: number; }):
JSX.Element => (
  uri ? (
    <Image
      style={[styles.profilePhoto, { borderRadius: size / 2, width: size, height: size }]}
      source={{ uri }}
    />
  ) : <AntDesign style={{ marginTop: 3 }} name="user" size={size - 3} color="white" />
);

export default ProfilePhoto;
