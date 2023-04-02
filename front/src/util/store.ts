import { configureStore } from '@reduxjs/toolkit';
import loginReducer from 'reducers/loginReducer';
import userReducer from '../reducers/userReducer';

const store = configureStore({
  reducer: {
    profileProps: userReducer,
    loggedIn: loginReducer
  }
});

export default store;
