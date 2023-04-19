import { useEffect, useState } from 'react';
import { User } from '@shared/types';
import { View, StyleSheet, Pressable } from 'react-native';
import { dpw } from 'util/helpers';
import Text from 'components/Text';
import { createFollow, removeFollow } from 'services/follows';
import Line from 'components/Line';
import { setUser as setUserAction } from 'reducers/profileUser';
import { Ionicons } from '@expo/vector-icons';
import usePosts from 'hooks/usePosts';
import useProfilePosts from 'hooks/useProfilePosts';
import Loading from '../components/Loading';
import UserBar from '../components/UserBar';
import GridView from '../components/GridView';
import { UserScreen } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Button from '../components/Button';
import { getUser } from '../services/users';

const styles = StyleSheet.create({
  bio: {
    marginTop: dpw(0.05)
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: dpw(0.028)
  },
  infoItem: {
    flexDirection: 'column',
    alignItems: 'center'
  }
});

const Profile = ({ route, navigation }: UserScreen<'StackProfile'>): JSX.Element => {
  const currentUserId = useAppSelector((state): string => state.currentUserId!);
  const [user, setUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const userId = route.params?.id || currentUserId;
  const [posts, fetchPosts] = currentUserId === userId ? useProfilePosts() : usePosts();
  const finalUser =
    userId === currentUserId ? useAppSelector((state): User => state.profileUser!) : user;

  const settings = (): JSX.Element => (
    <Pressable hitSlop={10} onPress={(): void => navigation.navigate('Settings')}>
      <Ionicons name="settings-sharp" size={24} color="black" />
    </Pressable>
  );

  useEffect((): void => {
    if (userId === currentUserId) {
      navigation.setOptions({ headerRight: settings });
    }
    const initialize = async (): Promise<void> => {
      await fetchPosts(currentUserId !== userId ? { userId } : undefined);
    };
    initialize();
  }, []);

  useEffect((): void => {
    const initialize = async (): Promise<void> => {
      try {
        const res = await getUser(userId);
        if (userId === currentUserId) {
          dispatch(setUserAction(res.data));
        } else {
          setUser(res.data);
        }
        setUser(res.data);
      } catch {}
    };
    initialize();
  }, [userId, currentUserId]);

  useEffect((): void => {
    if (route.params?.username) {
      navigation.setOptions({ title: route.params.username });
    }
    if (finalUser && !route.params?.username) {
      navigation.setOptions({ title: finalUser.username });
    }
  }, [finalUser]);

  if (!finalUser || !posts) {
    return <Loading />;
  }

  const onFollow = async (): Promise<void> => {
    try {
      const res = await createFollow({ userId });
      setUser({ ...finalUser, followId: res.data.id, followers: finalUser.followers + 1 });
    } catch {}
  };

  const onUnfollow = async (): Promise<void> => {
    try {
      await removeFollow(finalUser.followId!);
      setUser({ ...finalUser, followId: null, followers: finalUser.followers - 1 });
    } catch {}
  };

  const onEditProfile = (): void => {
    navigation.navigate('EditProfile', finalUser);
  };

  const extraSecond =
    currentUserId === userId ? undefined : finalUser.followId ? (
      <Button o text="Unfollow" size="small" onPress={onUnfollow} />
    ) : (
      <Button text="Follow" size="small" onPress={onFollow} />
    );

  const extra =
    currentUserId === userId ? (
      <Button
        style={{ marginBottom: dpw(0.005) }}
        highlight={false}
        text="Edit profile"
        size="small"
        onPress={onEditProfile}
      />
    ) : (
      <Button
        onPress={(): void =>
          navigation.navigate('SingleChat', { userId: finalUser.id, username: finalUser.username })
        }
        size="small"
        text="Message"
      />
    );

  const header = (): JSX.Element => (
    <View>
      <View style={{ padding: dpw(0.05) }}>
        <UserBar
          displayNameStyle={{ marginBottom: dpw(0.02) }}
          user={finalUser}
          profilePhotoSize={70}
          extra={extra}
          extraSecond={extraSecond}
        />
        <View style={styles.bio}>
          <Text weight="bold">{finalUser.displayName}</Text>
          <Text>{finalUser.bio}</Text>
        </View>
      </View>
      <Line />
      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Text>{posts.totalItems.toString()}</Text>
          <Text color="grey">posts</Text>
        </View>
        <Pressable
          onPress={(): void =>
            navigation.navigate('Follows', {
              userId,
              role: 'follower',
              username: finalUser.username
            })
          }
        >
          <View style={styles.infoItem}>
            <Text>{finalUser.followers.toString()}</Text>
            <Text color="grey">followers</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={(): void =>
            navigation.navigate('Follows', {
              userId,
              role: 'following',
              username: finalUser.username
            })
          }
        >
          <View style={styles.infoItem}>
            <Text>{finalUser.following.toString()}</Text>
            <Text color="grey">following</Text>
          </View>
        </Pressable>
      </View>
      <Line />
    </View>
  );

  return posts.data.length > 0 ? (
    <GridView
      ListHeaderComponent={header}
      ListHeaderComponentStyle={{ marginBottom: dpw(0.06) }}
      posts={posts.data}
      onEndReached={(): Promise<void> =>
        fetchPosts(currentUserId !== userId ? { userId } : undefined)
      }
      onEndReachedThreshold={0.2}
    />
  ) : (
    <View style={{ flexGrow: 1 }}>
      {header()}
      <View style={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text weight="bold" size="subheading" align="center">
          No posts to show
        </Text>
      </View>
    </View>
  );
};

export default Profile;
