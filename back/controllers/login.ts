import express from 'express';
import got from 'got';
import { UserBase } from '@shared/types';
import { FIREBASE_API_KEY } from '../util/config.js';
import User from '../models/user.js';

const router = express.Router();

interface LoginBody {
  email: string;
  password: string;
}

type LoginResponse = UserBase & { idToken: string; refreshToken: string };

interface FirebaseLoginRes {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
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
    id: user.localId,
    idToken: user.idToken,
    photoUrl: dbUser.photoUrl,
    refreshToken: user.refreshToken,
    username: dbUser.username,
    bio: dbUser.bio,
    displayName: dbUser.displayName,
    email: user.email
  });
});

export default router;
