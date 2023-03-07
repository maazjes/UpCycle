import useFollows from 'hooks/useFollows';
import { UserStackScreen } from 'types';
import Loading from 'components/Loading';
import UserBar from 'components/UserBar';
import { addFollow, removeFollow } from 'services/follows';
import { FlatList } from 'react-native';
import { useAppSelector } from 'hooks/redux';
import { Follow, TokenUser } from '@shared/types';
import Button from 'components/Button';
import { AxiosResponse } from 'axios';
import Text from 'components/Text';

const Follows = ({ route }: UserStackScreen<'Follows'>): JSX.Element => {
  const { userId, role } = route.params;
  const [follows, fetchFollows] = useFollows({ userId, role });
  const currentUser = useAppSelector((state): TokenUser => state.user!);

  if (!follows) {
    return <Loading />;
  }

  if (follows.data.length === 0) {
    return (
      <Text>
        {role === 'follower'
          ? 'No followers to show'
          : 'No followings to show'}
      </Text>
    );
  }

  return (
    <FlatList
      keyExtractor={(item): string => String(item.id)}
      data={follows.data}
      renderItem={({ item }): JSX.Element => {
        const following = item.followerId === currentUser.id;
        const onPress = ():
        Promise<AxiosResponse<Follow>> |
        Promise<AxiosResponse<undefined>> => (following
          ? removeFollow(userId)
          : addFollow({ userId }));
        const buttonText = following ? 'Unfollow' : 'Follow';
        return (
          <UserBar
            itemRight={<Button onPress={onPress} text={buttonText} />}
            user={item[role]!}
          />
        );
      }}
      onEndReached={fetchFollows}
      onEndReachedThreshold={0.2}
    />
  );
};

export default Follows;
