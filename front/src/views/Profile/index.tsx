import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View
} from 'react-native';
import { TokenUser, User } from '@shared/types';
import Loading from '../../components/Loading';
import UserBar from '../../components/UserBar';
import GridView from '../../components/GridView';
import { UserStackScreen } from '../../types';
import { useAppSelector } from '../../hooks/redux';
import ProfileOptions from './ProfileOptions';
import Button from '../../components/Button';
import { getUser } from '../../services/users';

const Profile = ({ route, navigation }:
UserStackScreen<'StackProfile'>):
JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser => state.user);
  const title = route.params?.username || currentUser.username;
  const userId = route.params?.userId || currentUser.id;

  useEffect((): void => {
    navigation.setOptions({ title });
  }, [title]);

  const [user, setUser] = useState<User | null>();

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getUser({ userId });
      setUser(res.data);
    };
    initialize();
  }, []);

  if (!user) {
    return <Loading />;
  }

  const itemRight = userId === currentUser?.id && userId
    ? <ProfileOptions user={user} />
    : <Button onSubmit={(): null => null} style={{ paddingHorizontal: 10, height: 32 }} text="Message" />;

  return (
    <View>
      <UserBar itemRight={itemRight} user={user} profilePhotoSize={70} />
      <GridView posts={user.posts ?? []} />
    </View>
  );
};

export default Profile;
