import { useState, useEffect } from 'react';
import usersService from '../services/users';
import { User } from '../types';

const useUser = (userId: number): User | null => {
  const [user, setUser] = useState<User | null>(null);
  useEffect((): void => {
    const getUser = async (): Promise<void> => {
      const response = await usersService.getUserById(userId);
      const body = response.data;
      if (body) {
        setUser(body);
      }
    };
    getUser();
  }, []);
  return user;
};

export default useUser;
