import { useContext } from 'react';
import AuthStorage from '../util/authStorage';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = (): AuthStorage => useContext(AuthStorageContext);

export default useAuthStorage;
