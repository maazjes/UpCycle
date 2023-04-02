import { useEffect, useState } from 'react';
import { User } from '@shared/types';
import usePosts from 'hooks/usePosts';
import { View, StyleSheet, Pressable } from 'react-native';
import { dph } from 'util/helpers';
import Text from 'components/Text';
import { createFollow, removeFollow } from 'services/follows';
import Line from 'components/Line';
import useAuth from 'hooks/useAuth';
import MenuModal from 'components/MenuModal';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';
import GridView from '../components/GridView';
import { ProfileProps, UserScreen } from '../types';
import { useAppSelector } from '../hooks/redux';
import Button from '../components/Button';
import { getUser } from '../services/users';

const styles = StyleSheet.create({
  bio: {
    marginTop: dph(0.03)
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: dph(0.014)
  },
  infoItem: {
    flexDirection: 'column',
    alignItems: 'center'
  }
});

const Profile = ({ route, navigation }: UserScreen<'StackProfile'>): JSX.Element => {
  const profileParams = useAppSelector((state): ProfileProps => state.profileProps!);
  const currentUserId = profileParams.id;
  const [user, setUser] = useState<User>();
  const [modalVisible, setModalVisible] = useState(false);
  const { navigate } = navigation;
  const { logout } = useAuth();
  const title = route.params?.username || profileParams.username;
  const { id: userId } = route.params || profileParams;
  const [posts, fetchPosts] = usePosts({ userId });

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      const res = await getUser(userId);
      setUser(res.data);
    };
    navigation.setOptions({ title });
    initialize();
  }, [userId]);

  useEffect((): void => {
    if (user) {
      setUser(route.params as User);
    }
  }, [route.params]);

  if (!user || !posts) {
    return <Loading />;
  }

  const onFollow = async (): Promise<void> => {
    try {
      const res = await createFollow({ userId });
      setUser({ ...user, followId: res.data.id, followers: user.followers + 1 });
    } catch (e) {}
  };

  const onUnfollow = async (): Promise<void> => {
    try {
      await removeFollow(user.followId!);
      setUser({ ...user, followId: null, followers: user.followers - 1 });
    } catch (e) {}
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

  const extraSecond =
    currentUserId === userId ? undefined : user.followId ? (
      <Button o text="Unfollow" size="small" onPress={onUnfollow} />
    ) : (
      <Button text="Follow" size="small" onPress={onFollow} />
    );

  const extra =
    currentUserId === userId ? (
      <Button
        highlight={false}
        text="options"
        size="small"
        onPress={(): void => setModalVisible(true)}
      />
    ) : (
      <Button
        onPress={(): void => navigation.getParent()?.navigate('Chat')}
        size="small"
        text="Message"
      />
    );

  const header = (): JSX.Element => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ padding: '5%' }}>
        <UserBar user={user} profilePhotoSize={70} extra={extra} extraSecond={extraSecond} />
        <View style={styles.bio}>
          <Text weight="bold">{user.displayName}</Text>
          <Text>{user.bio}</Text>
        </View>
      </View>
      <Line />
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Text>{posts.totalItems.toString()}</Text>
          <Text color="grey">posts</Text>
        </View>
        <Pressable onPress={(): void => navigate('Follows', { userId, role: 'follower' })}>
          <View style={styles.infoItem}>
            <Text>{user.followers.toString()}</Text>
            <Text color="grey">followers</Text>
          </View>
        </Pressable>
        <Pressable onPress={(): void => navigate('Follows', { userId, role: 'following' })}>
          <View style={styles.infoItem}>
            <Text>{user.following.toString()}</Text>
            <Text color="grey">following</Text>
          </View>
        </Pressable>
      </View>
      <Line />
    </View>
  );

  const footer = (): JSX.Element => (
    <MenuModal
      items={menuModalItems}
      visible={modalVisible}
      onDismiss={(): void => setModalVisible(false)}
    />
  );

  return (
    <GridView
      ListHeaderComponent={header}
      posts={posts.data}
      onEndReached={(): Promise<void> => fetchPosts()}
      onEndReachedThreshold={0.3}
      ListFooterComponent={footer}
    />
  );
};

export default Profile;
