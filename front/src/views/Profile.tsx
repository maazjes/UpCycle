import * as React from 'react';
import { useEffect, useState } from 'react';
import Container from 'components/Container';
import { TokenUser, User } from '@shared/types';
import usePosts from 'hooks/usePosts';
import { View, StyleSheet, Pressable } from 'react-native';
import { dph } from 'util/helpers';
import Text from 'components/Text';
import { createFollow, removeFollow } from 'services/follows';
import Line from 'components/Line';
import useAuth from 'hooks/useAuth';
import MenuModal from 'components/MenuModal';
import useNotification from 'hooks/useNotification';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';
import GridView from '../components/GridView';
import { UserStackScreen } from '../types';
import { useAppSelector } from '../hooks/redux';
import Button from '../components/Button';
import { getUser } from '../services/users';
import Scrollable from '../components/Scrollable';

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
  }
});

const Profile = ({ route, navigation }:
UserStackScreen<'StackProfile'>):
JSX.Element => {
  const currentUser = useAppSelector((state): TokenUser => state.user!);
  const [user, setUser] = useState<User | null>();
  const [modalVisible, setModalVisible] = useState(false);
  const { navigate } = navigation;
  const { logout } = useAuth();
  const notification = useNotification();
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
    try {
      const res = await createFollow({ userId });
      setUser({ ...user, followId: res.data.id, followers: user.followers + 1 });
    } catch (e) {
      notification({ message: 'Following user failed. Please try again.', error: true, modal: true });
    }
  };

  const onUnfollow = async (): Promise<void> => {
    try {
      await removeFollow(user.followId!);
      setUser({ ...user, followId: null, followers: user.followers - 1 });
    } catch (e) {
      notification({ message: 'Unfollowing user failed. Please try again.', error: true, modal: true });
    }
  };

  const onEditProfile = (): void => {
    navigate('EditProfile', user);
    setModalVisible(false);
  };

  const onLogout = (): void => {
    logout();
    setModalVisible(false);
  };

  const menuModalItems = {
    'Edit profile': onEditProfile,
    'log out': onLogout
  };

  const extraSecond = currentUser.id === userId
    ? undefined
    : user.followId
      ? <Button o text="Unfollow" size="small" onPress={onUnfollow} />
      : <Button text="Follow" size="small" onPress={onFollow} />;

  const extra = currentUser.id === userId
    ? <Button text="options" size="small" onPress={(): void => setModalVisible(true)} />
    : <Button onPress={(): null => null} size="small" text="Message" />;

  return (
    <Container>
      <Scrollable
        onEndReached={(): Promise<void> => fetchPosts({ userId })}
      >
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
        <Line />
        <GridView style={{ marginTop: 20 }} posts={posts.data} />
      </Scrollable>
      <MenuModal
        items={menuModalItems}
        visible={modalVisible}
        onDismiss={(): void => setModalVisible(false)}
      />
    </Container>
  );
};

export default Profile;
