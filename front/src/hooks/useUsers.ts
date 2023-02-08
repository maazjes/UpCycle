import { useState } from 'react';
import usersService from '../services/users';
import { User, GetUsersParams } from '../types';

const useUsers = (): [User[] | null, typeof getUsers] => {
  const [users, setUsers] = useState<User[] | null>(null);
  const getUsers = async (params: GetUsersParams): Promise<void> => {
    const response = await usersService.getUsers(params);
    const body = response.data;
    if (body) {
      setUsers(body);
    }
  };
  return [users, getUsers];
};

export default useUsers;
