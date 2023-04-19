import useFollows from 'hooks/useFollows';
import { UserScreen } from 'types';
import Loading from 'components/Loading';
import UserBar from 'components/UserBar';
import { createFollow, removeFollow } from 'services/follows';
import { FlatList, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import Button from 'components/Button';
import Text from 'components/Text';
import Container from 'components/Container';
import { addFollowing, removeFollowing } from 'reducers/profileUser';
import { dpw } from 'util/helpers';
import { Follow } from '@shared/types';
import { useEffect } from 'react';

const styles = StyleSheet.create({
  userBar: {
    paddingVertical: dpw(0.02)
  }
});

const Follows = ({ route, navigation }: UserScreen<'Follows'>): JSX.Element => {
  const { userId, role } = route.params;
  const [follows, setFollows, fetchFollows] = useFollows({ userId, role });
  const currentUserId = useAppSelector((state): string => state.currentUserId!);
  const dispatch = useAppDispatch();

  useEffect((): void => {
    navigation.setOptions({
      title:
        role === 'follower'
          ? `${route.params.username}'s followers`
          : `Followed by ${route.params.username}`
    });
  }, []);

  if (!follows) {
    return <Loading />;
  }

  if (follows.data.length === 0) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text size="subheading">
          {role === 'follower' ? 'No followers to show' : 'No followings to show'}
        </Text>
      </Container>
    );
  }

  const onFollow = async (follow: Follow): Promise<void> => {
    const newData = [...follows.data];
    const newFollow = newData.find((f): boolean => f.user.id === follow.user.id)!;
    try {
      console.log(userId);
      console.log(currentUserId);
      const res = await createFollow({ userId });
      newFollow.user.followers = [{ id: res.data.id }];
      setFollows({ ...follows, data: newData });
      dispatch(addFollowing());
    } catch (e) {
      console.log(e);
    }
  };

  const onUnfollow = async (follow: Follow): Promise<void> => {
    const newData = [...follows.data];
    const newFollow = newData.find((f): boolean => f.user.id === follow.user.id)!;
    try {
      await removeFollow(follow.user.followers[0].id);
      newFollow.user.followers = [];
      setFollows({ ...follows, data: newData });
      dispatch(removeFollowing());
    } catch {}
  };

  return (
    <Container>
      <FlatList
        keyExtractor={(item): string => String(item.id)}
        data={follows.data}
        renderItem={({ item }): JSX.Element => {
          const following = item.user.followers.length > 0;
          const buttonText = following ? 'Unfollow' : 'Follow';
          const itemRight =
            currentUserId !== item.user.id ? (
              <Button
                o={following}
                size="small"
                onPress={
                  following
                    ? (): Promise<void> => onUnfollow(item)
                    : (): Promise<void> => onFollow(item)
                }
                text={buttonText}
              />
            ) : undefined;
          return (
            <UserBar
              style={styles.userBar}
              profilePhotoSize={dpw(0.11)}
              itemRight={itemRight}
              user={item.user}
            />
          );
        }}
        onEndReached={fetchFollows}
        onEndReachedThreshold={0.2}
      />
    </Container>
  );
};

export default Follows;
