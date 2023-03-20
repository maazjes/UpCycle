import { StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  profilePhoto: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const ProfilePhoto = ({
  uri, size = 30
}: {
  uri: string | null; size?: number; }):
JSX.Element => (
  <Image
    style={[styles.profilePhoto, { borderRadius: size / 2, width: size, height: size }]}
    source={{ uri: uri ? `${uri}_100x100` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png' }}
  />

);

export default ProfilePhoto;
