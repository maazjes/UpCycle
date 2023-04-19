import express from 'express';
import got from 'got';
import { TokenUser, LoginBody } from '@shared/types.js';
import { Op } from 'sequelize';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { Follow } from '../models/index.js';
import { FIREBASE_API_KEY } from '../util/config.js';
import User from '../models/user.js';
import { FirebaseLoginRes } from '../types.js';
import firebase from '../util/firebase.js';

const router = express.Router();

router.post<{}, TokenUser, LoginBody>('/', async (req, res): Promise<void> => {
  const { email, username, password } = req.body;
  let fbUser: UserRecord;
  let dbUser: User | null;
  if (email) {
    fbUser = await firebase.auth().getUserByEmail(email);
    dbUser = await User.findOne({ where: { id: fbUser.uid } });
    if (!dbUser) {
      throw new Error('Invalid username or email address.');
    }
  } else {
    dbUser = await User.findOne({
      where: { username: { [Op.iLike]: username } },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    if (!dbUser) {
      throw new Error('Invalid username or email address.');
    }
    fbUser = await firebase.auth().getUser(dbUser.id);
  }
  let loginUser;
  try {
    loginUser = await got
      .post(
        // eslint-disable-next-line max-len
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          json: {
            email: fbUser.email,
            password,
            returnSecureToken: true
          }
        }
      )
      .json<FirebaseLoginRes>();
  } catch {
    throw new Error('Invalid username or password.');
  }
  if (!loginUser.registered) {
    throw new Error('User not registered. Please register a new account.');
  }
  const followers = await Follow.count({ where: { followingId: fbUser.uid } });
  const following = await Follow.count({ where: { followerId: fbUser.uid } });
  res.json({
    ...dbUser.dataValues,
    idToken: loginUser.idToken,
    refreshToken: loginUser.refreshToken,
    following,
    followers,
    followId: null,
    email: fbUser.email!
  });
});

export default router;
