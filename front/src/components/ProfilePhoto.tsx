import { StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  photo: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

interface ProfilePhotoProps {
  uri: string | null;
  size?: number;
}

const ProfilePhoto = ({ uri, size = 30 }: ProfilePhotoProps): JSX.Element => (
  <Image
    style={[styles.photo, { borderRadius: size / 2, width: size, height: size }]}
    source={{
      uri:
        uri && uri.startsWith('file')
          ? uri
          : uri
          ? `${uri}_100x100?alt=media`
          : // eslint-disable-next-line max-len
            'https://firebasestorage.googleapis.com/v0/b/second-hand-c2a91.appspot.com/o/image_1679940077229_100x100?alt=media',
      cache: 'force-cache'
    }}
  />
);

export default ProfilePhoto;
