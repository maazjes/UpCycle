import * as React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import PrivateProfile from './views/PrivateProfile';
import PublicProfile from './views/PublicProfile';
import AppBar from './components/AppBar';
import CreatePost from './views/CreatePost';
import EditPost from './views/EditPost';
import Main from './views/Main';
import Login from './views/Login';
import Signup from './views/SignUp';
import SinglePost from './views/SinglePost';
import Notification from './components/Notification';
import Favorites from './views/Favorites';
import BottomNav from './components/BottomNav';

export default (): JSX.Element => (
  <View>
    <AppBar />
    <Notification />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/new-post" element={<CreatePost />} />
      <Route path="/posts/edit/:postId" element={<EditPost />} />
      <Route path="/profile" element={<PrivateProfile />} />
      <Route path="/users/:userId" element={<PublicProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/posts/:postId" element={<SinglePost />} />
      <Route path="/favorites/:userId" element={<Favorites />} />
    </Routes>
  </View>
);
