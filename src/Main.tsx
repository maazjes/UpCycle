import * as React from 'react';
import { Text, View } from 'react-native';
import { Route, Routes, Navigate } from 'react-router-native';
import Profile from './views/Profile';
import Menu from './components/Menu';
import AppBar from './components/AppBar';

export default () => (
  <View>
    <AppBar />
    <Routes>
      <Route path="/" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </View>
);
