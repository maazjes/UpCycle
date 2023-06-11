import admin from 'firebase-admin';
import { SERVICE_ACCOUNT } from './config.js';

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT),
  storageBucket: 'second-hand-images'
});

export default admin;
