import * as React from 'react';
import { useEffect, useState } from 'react';
import Container from 'components/Container';
import { TokenUser, User } from '@shared/types';
import usePosts from 'hooks/usePosts';
import {
  View, StyleSheet, Pressable, ScrollView
} from 'react-native';
import { dpw, dph } from 'util/helpers';
import Text from 'components/Text';
import { createFollow, removeFollow } from 'services/follows';
import Line from 'components/Line';
import Loading from '../../components/Loading';
import UserBar from '../../components/UserBar';
import GridView from '../../components/GridView';
import { UserStackScreen } from '../../types';
import { useAppSelector } from '../../hooks/redux';
import ProfileOptions from './ProfileOptions';
import Button from '../../components/Button';
import { getUser } from '../../services/users';

const styles = StyleSheet.create({
  bio: {
    marginTop: dph(0.03),
    marginBottom: dph(0.025)
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: dph(0.017)
  },
  infoItem: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  gridView: {
    marginTop: dph(0.03)
  }
});

const Profile = ({ route, navigation }:
UserStackScreen<'StackProfile'>):
JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser => state.user!);
  const [user, setUser] = useState<User | null>();
  const { navigate } = navigation;

  const title = route.params?.username || currentUser.username;
  const userId = route.params?.userId || currentUser.id;

  const [posts, fetchPosts] = usePosts({ userId });

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

  const onFollow = async (): Promise<void> => {
    const res = await createFollow({ userId });
    setUser({ ...user, followId: res.data.id, followers: user.followers + 1 });
  };

  const onUnfollow = (): void => {
    removeFollow(user.followId!);
    setUser({ ...user, followId: null, followers: user.followers - 1 });
  };

  const extraSecond = currentUser.id === userId
    ? undefined
    : user.followId
      ? <Button o text="Unfollow" size="small" onPress={onUnfollow} />
      : <Button text="Follow" size="small" onPress={onFollow} />;

  const extra = currentUser.id === userId
    ? <ProfileOptions user={user} />
    : <Button onPress={(): null => null} size="small" text="Message" />;

  return (
    <Container>
      <UserBar
        user={user}
        profilePhotoSize={70}
        extra={extra}
        extraSecond={extraSecond}
      />
      <View style={styles.bio}>
        <Text weight="bold">{user.displayName}</Text>
        <Text>{user.bio}</Text>
      </View>
      <Line />
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Text weight="bold">{posts.totalItems.toString()}</Text>
          <Text>posts</Text>
        </View>
        <Pressable onPress={(): void => navigate('Follows', { userId, role: 'follower' })}>
          <View style={styles.infoItem}>
            <Text weight="bold">{user.followers.toString()}</Text>
            <Text>followers</Text>
          </View>
        </Pressable>
        <Pressable onPress={(): void => navigate('Follows', { userId, role: 'following' })}>
          <View style={styles.infoItem}>
            <Text weight="bold">{user.following.toString()}</Text>
            <Text>following</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.line} />
      <GridView
        style={styles.gridView}
        posts={posts.data}
        onEndReachedThreshold={0.2}
        onEndReached={fetchPosts}
      />
    </Container>
  );
};

export default Profile;
