import useFollows from 'hooks/useFollows';
import { ProfileProps, UserStackScreen } from 'types';
import Loading from 'components/Loading';
import UserBar from 'components/UserBar';
import { createFollow, removeFollow } from 'services/follows';
import { FlatList } from 'react-native';
import { useAppSelector } from 'hooks/redux';
import { Follow } from '@shared/types';
import Button from 'components/Button';
import { AxiosResponse } from 'axios';
import Text from 'components/Text';
import Container from 'components/Container';

const Follows = ({ route, navigation }: UserStackScreen<'Follows'>): JSX.Element => {
  const { userId, role } = route.params;
  const [follows, fetchFollows] = useFollows({ userId, role });
  const { id: currentUserId } = useAppSelector((state): ProfileProps => state.profileProps!);

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

  return (
    <Container>
      <FlatList
        keyExtractor={(item): string => String(item.id)}
        data={follows.data}
        renderItem={({ item }): JSX.Element => {
          const following = item.followerId === currentUserId;
          const onPress = (): Promise<AxiosResponse<Follow>> | Promise<AxiosResponse<undefined>> =>
            following ? removeFollow(item.id) : createFollow({ userId });
          const buttonText = following ? 'Unfollow' : 'Follow';
          const itemRight =
            (item.following?.id || item.follower?.id) === currentUserId ? undefined : (
              <Button o={following} size="small" onPress={onPress} text={buttonText} />
            );
          return (
            <UserBar
              onPress={(): void =>
                navigation.getParent()?.navigate('Profile', {
                  userId: item[role]!.id,
                  username: item[role]!.username
                })
              }
              itemRight={itemRight}
              user={item[role]!}
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
