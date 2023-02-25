import * as React from 'react';
import { useEffect } from 'react';
import {
  View, StyleSheet
} from 'react-native';
import Loading from '../../components/Loading';
import UserBar from '../../components/UserBar';
import GridView from '../../components/GridView';
import { TokenUser, UserStackScreen } from '../../types';
import { useAppSelector } from '../../hooks/redux';
import ProfileOptions from './ProfileOptions';
import Button from '../../components/Button';
import useUsers from '../../hooks/useUsers';

const styles = StyleSheet.create({
  container: {
  }
});

const Profile = ({ route, navigation }:
UserStackScreen<'StackProfile'>):
JSX.Element => {
  const { userId, displayName } = route.params;
  if (displayName) {
    navigation.setOptions({ title: displayName });
  }
  const currentUser = useAppSelector((state): TokenUser | null => state.user);
  const [users, getUsers] = useUsers();

  useEffect((): void => {
    getUsers({ userId });
  }, []);

  if (!users) {
    return <Loading />;
  }

  const user = users[0];

  const itemRight = userId === currentUser?.id && userId
    ? <ProfileOptions user={user} />
    : <Button onSubmit={(): null => null} style={{ paddingHorizontal: 10, height: 32 }} text="Message" />;

  return (
    <View style={styles.container}>
      <UserBar itemRight={itemRight} user={user} profileImageSize={70} />
      <GridView posts={user.posts ?? []} />
    </View>
  );
};

export default Profile;
