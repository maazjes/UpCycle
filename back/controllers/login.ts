import express from 'express';
import got from 'got';
import { FIREBASE_API_KEY } from '../util/config.js';
import { FirebaseLoginRes } from '../types.js';
import User from '../models/user.js';

const router = express.Router();

interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  token: string;
  email: string;
  displayName: string;
}

router.post<{}, LoginResponse, LoginBody>('/', async (
  req,
  res
): Promise<void> => {
  const { email, password } = req.body;
  const user = await got.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      json: {
        email,
        password,
        returnSecureToken: true
      }
    }
  ).json<FirebaseLoginRes>();
  if (!user.registered) {
    throw new Error('invalid username');
  }
  const dbUser = await User.findOne({ where: { id: user.localId } });
  if (!dbUser) {
    throw new Error('invalid username');
  }
  res.status(200).json({
    id: user.localId, token: user.idToken, email: user.email, displayName: dbUser.displayName
  });
});

export default router;
