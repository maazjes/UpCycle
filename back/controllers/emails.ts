import express from 'express';
import { CheckEmailVerified, EmailBody, FirebaseUser } from '@shared/types.js';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { userExtractor } from '../util/middleware.js';
import { sendEmail } from '../util/helpers.js';
import firebase from '../util/firebase.js';
import { User } from '../models/index.js';

const router = express.Router();

router.post<{}, FirebaseUser, EmailBody>(
  '/sendverificationemail',
  async (req, res): Promise<void> => {
    const { email } = req.body;
    let id: string;
    try {
      const fbUser = await firebase.auth().getUserByEmail(email);
      id = fbUser.uid;
    } catch {
      const fbUser = await firebase.auth().createUser({ email });
      id = fbUser.uid;
    }
    const user = await User.findOne({ where: { id } });
    if (user) {
      throw new Error('An user with this email address already exists');
    }
    const actionCodeSettings = {
      url: 'https://tinyurl.com/upcycleverifyemail'
    };
    const actionLink = await firebase
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);
    await sendEmail(
      email,
      'Verify your email address',
      `Thanks for signing up with us. Follow the link below to verify your email address.
  \n${actionLink}`
    );
    res.json({ email: req.body.email, id });
  }
);

router.post<{}, CheckEmailVerified, EmailBody>(
  '/checkverified',
  async (req, res): Promise<void> => {
    const user = await firebase.auth().getUserByEmail(req.body.email);
    res.json({ email: user.email!, verified: user.emailVerified });
  }
);

router.post<{}, {}, EmailBody>('/changeemail', userExtractor, async (req, res): Promise<void> => {
  const { email } = req.body;
  const user = await firebase.auth().getUser(req.userId!);
  let fbUser: UserRecord | null;
  try {
    fbUser = await firebase.auth().getUserByEmail(email);
    const dbUser = await User.findOne({ where: { id: fbUser.uid } });
    if (dbUser) {
      throw new Error('An user with this email address already exists');
    }
  } catch {
    fbUser = null;
  }
  const actionCodeSettings = {
    url: 'https://tinyurl.com/upcyclechangeemail'
  };
  const actionLink = await firebase
    .auth()
    .generateVerifyAndChangeEmailLink(user.email!, email, actionCodeSettings);
  await sendEmail(
    email,
    'Change your email',
    `Change your email address from the link below.\n${actionLink}`
  );
  res.status(200).send();
});

export default router;
