import express from 'express';
import { CheckEmailVerified, EmailVerifyBody, FirebaseUser } from '@shared/types.js';
import { sendVerificationEmail } from '../util/helpers.js';
import firebase from '../util/firebase.js';

const router = express.Router();

router.post<{}, FirebaseUser, EmailVerifyBody>('/sendemail', async (req, res): Promise<void> => {
  await firebase.auth().createUser({ email: req.body.email });
  const actionCodeSettings = {
    url: 'https://tinyurl.com/upcycleapp',
    handleCodeInApp: true
  };
  const actionLink = await firebase
    .auth()
    // @ts-ignore
    .generateEmailVerificationLink('marzusness@gmail.com', actionCodeSettings);
  await sendVerificationEmail('marzusness@gmail.com', actionLink);
  res.status(200).json({ email: req.body.email, id: 'asd' });
});

router.post<{}, CheckEmailVerified, EmailVerifyBody>(
  '/checkverified',
  async (req, res): Promise<void> => {
    const user = await firebase.auth().getUserByEmail(req.body.email);
    res.status(200).json({ verified: user.emailVerified });
  }
);

export default router;
