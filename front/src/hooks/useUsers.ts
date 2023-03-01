import { useState } from 'react';
import { FollowUser, GetUsersQuery } from '@shared/types';
import { getUsers } from '../services/users';

const useUsers = (): [FollowUser[] | null, typeof fetchMore] => {
  const [users, setUsers] = useState<FollowUser[] | null>(null);
  const fetchMore = async (params: GetUsersQuery): Promise<void> => {
    const res = await getUsers(params);
    if (res.data) {
      setUsers((users ?? []).concat(res.data));
    }
  };
  return [users, fetchMore];
};

export default useUsers;
