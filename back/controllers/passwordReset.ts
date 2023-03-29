import express from 'express';
import got from 'got';
import {
  PasswordResetBody,
  PasswordResetConfirmationBody,
  PasswordResetVerifyBody
} from '@shared/types.js';
import { FirebasePasswordResetRes } from 'types';
import { FIREBASE_API_KEY } from '../util/config.js';

const router = express.Router();

router.post<{}, {}, PasswordResetBody>('/sendemail', async (req, res): Promise<void> => {
  const { email } = req.body;
  await got
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
      {
        json: {
          email,
          requestType: 'PASSWORD_RESET'
        }
      }
    )
    .json<PasswordResetBody>();
  res.status(200).json();
});

router.post<{}, {}, PasswordResetVerifyBody>('/verifycode', async (req, res): Promise<void> => {
  const { oobCode } = req.body;
  await got
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`,
      {
        json: {
          oobCode
        }
      }
    )
    .json<FirebasePasswordResetRes>();
  res.status(200).json();
});

router.post<{}, {}, PasswordResetConfirmationBody>('/confirm', async (req, res): Promise<void> => {
  const { oobCode, newPassword } = req.body;
  await got
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`,
      {
        json: {
          oobCode,
          newPassword
        }
      }
    )
    .json<FirebasePasswordResetRes>();
  res.status(200).json();
});

export default router;
