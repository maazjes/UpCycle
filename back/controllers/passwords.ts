import express from 'express';
import { PasswordBody, EmailBody } from '@shared/types.js';
import { sendEmail } from '../util/helpers.js';
import firebase from '../util/firebase.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.post<{}, {}, EmailBody>('/sendresetemail', async (req, res): Promise<void> => {
  const { email } = req.body;
  const actionCodeSettings = {
    url: 'https://tinyurl.com/upcyclelogin'
  };
  const actionLink = await firebase.auth().generatePasswordResetLink(email, actionCodeSettings);
  await sendEmail(
    email,
    'Reset your password',
    `Reset your password from the links below.
\n${actionLink}`
  );
  res.json();
});

router.post<{}, {}, PasswordBody>(
  '/changepassword',
  userExtractor,
  async (req, res): Promise<void> => {
    const { password } = req.body;
    await firebase.auth().updateUser(req.userId!, { password });
    res.status(200).send();
  }
);

export default router;
