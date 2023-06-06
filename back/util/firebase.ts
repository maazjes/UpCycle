import admin, { ServiceAccount } from 'firebase-admin';

import serviceAccount from './serviceAccount.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: 'second-hand-images'
});

export default admin;
