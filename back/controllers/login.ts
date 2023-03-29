import express from 'express';
import got from 'got';
import { TokenUser, LoginBody } from '@shared/types.js';
import { Op } from 'sequelize';
import { Follow } from '../models/index.js';
import { FIREBASE_API_KEY } from '../util/config.js';
import User from '../models/user.js';
import { FirebaseLoginRes } from '../types.js';

const router = express.Router();

router.post<{}, TokenUser, LoginBody>('/', async (req, res): Promise<void> => {
  const { email, username, password } = req.body;
  const where = email ? { email: { [Op.iLike]: email } } : { username: { [Op.iLike]: username } };
  const dbUser = await User.findOne({ where });
  if (!dbUser) {
    throw new Error('invalid username or email');
  }
  const user = await got
    .post(
      // eslint-disable-next-line max-len
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        json: {
          email: dbUser.email,
          password,
          returnSecureToken: true
        }
      }
    )
    .json<FirebaseLoginRes>();
  if (!user.registered) {
    throw new Error('invalid username');
  }
  const followers = await Follow.count({ where: { followingId: dbUser.id } });
  const following = await Follow.count({ where: { followerId: dbUser.id } });
  res.status(200).json({
    id: user.localId,
    idToken: user.idToken,
    photoUrl: dbUser.photoUrl,
    refreshToken: user.refreshToken,
    username: dbUser.username,
    bio: dbUser.bio,
    displayName: dbUser.displayName,
    email: user.email,
    following,
    followers,
    followId: null
  });
});

export default router;
