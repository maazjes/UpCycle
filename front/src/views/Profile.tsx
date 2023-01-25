import * as React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import PostRow from '../components/PostRow';
import { State, User } from '../types';

const Profile = (): JSX.Element => {
  const currentUser = useSelector<State, User>((state): User => state.user);

  return <View style={{ marginTop: 50 }} />;
};

export default Profile;
