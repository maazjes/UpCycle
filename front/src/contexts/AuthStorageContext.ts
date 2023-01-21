import React from 'react';
import AuthStorage from '../util/authStorage';

const AuthStorageContext = React.createContext(new AuthStorage());

export default AuthStorageContext;
