import * as React from 'react';
import { View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import Profile from './views/Profile';
import AppBar from './components/AppBar';
import NewPostForm from './views/NewPostForm';
import Main from './views/Main';
import LoginForm from './views/LoginForm';
import RegistrationForm from './views/RegistrationForm';
import SinglePost from './views/SinglePost';

export default (): JSX.Element => (
  <View>
    <AppBar />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/new-post" element={<NewPostForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/:postId" element={<SinglePost />} />
    </Routes>
  </View>
);
