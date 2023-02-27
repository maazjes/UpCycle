import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  View
} from 'react-native';
import Loading from '../../components/Loading';
import UserBar from '../../components/UserBar';
import GridView from '../../components/GridView';
import { TokenUser, User, UserStackScreen } from '../../types';
import { useAppSelector } from '../../hooks/redux';
import ProfileOptions from './ProfileOptions';
import Button from '../../components/Button';
import { getUser } from '../../services/users';

const Profile = ({ route, navigation }:
UserStackScreen<'StackProfile'>):
JSX.Element => {
  const { userId, username } = route.params;

  useEffect((): void => {
    navigation.setOptions({ title: username });
  }, [username]);

  const currentUser = useAppSelector((state): TokenUser => state.user);
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
    ? <ProfileOptions setUser={setUser} user={user} />
    : <Button onSubmit={(): null => null} style={{ paddingHorizontal: 10, height: 32 }} text="Message" />;

  return (
    <View>
      <UserBar itemRight={itemRight} user={user} profileImageSize={70} />
      <GridView posts={user.posts ?? []} />
    </View>
  );
};

export default Profile;
