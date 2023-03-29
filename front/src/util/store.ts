import { configureStore } from '@reduxjs/toolkit';
import modalReducer from 'reducers/modalReducer';
import loginReducer from 'reducers/loginReducer';
import userReducer from '../reducers/userReducer';
// eslint-disable-next-line import/no-cycle
import notificationReducer from '../reducers/notificationReducer';

const store = configureStore({
  reducer: {
    profileProps: userReducer,
    notification: notificationReducer,
    modal: modalReducer,
    loggedIn: loginReducer
  }
});

export default store;
