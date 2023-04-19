import { configureStore } from '@reduxjs/toolkit';
import loggedIn from 'reducers/loggedIn';
import favorites from 'reducers/favorites';
import profilePosts from 'reducers/profilePosts';
import singlePost from 'reducers/singlePost';
import profileUser from 'reducers/profileUser';
import currentUserId from '../reducers/currentUserId';
import chats from '../reducers/chats';

const store = configureStore({
  reducer: {
    currentUserId,
    loggedIn,
    favorites,
    profilePosts,
    singlePost,
    profileUser,
    chats
  }
});

export default store;
