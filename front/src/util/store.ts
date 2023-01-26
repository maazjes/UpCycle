import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';
// eslint-disable-next-line import/no-cycle
import notificationReducer from '../reducers/notificationReducer';

const store = configureStore({ reducer: { user: userReducer, notification: notificationReducer } });

export default store;
