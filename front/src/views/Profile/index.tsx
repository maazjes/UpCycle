import * as React from 'react';
import { useEffect, useState } from 'react';
import Container from 'components/Container';
import { TokenUser, BioUser } from '@shared/types';
import usePosts from 'hooks/usePosts';
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
  const currentUser = useAppSelector((state): TokenUser => state.user!);
  const [posts, fetchPosts] = usePosts();
  const [user, setUser] = useState<BioUser | null>();

  const title = route.params?.username || currentUser.username;
  const userId = route.params?.userId || currentUser.id;

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      navigation.setOptions({ title });
      const res = await getUser(userId);
      setUser(res.data);
    };
    initialize();
  }, []);

  if (!user || !posts) {
    return <Loading />;
  }

  const itemRight = userId === currentUser?.id && userId
    ? <ProfileOptions user={user} />
    : <Button onPress={(): null => null} style={{ paddingHorizontal: 10, height: 32 }} text="Message" />;

  return (
    <Container>
      <UserBar itemRight={itemRight} user={user} profilePhotoSize={70} />
      <GridView
        posts={posts.data}
        onEndReachedThreshold={0.2}
        onEndReached={fetchPosts}
      />
    </Container>
  );
};

export default Profile;
