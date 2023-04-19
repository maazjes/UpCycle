import express from 'express';
import got from 'got';
import { FIREBASE_API_KEY } from '../util/config.js';
import firebase from '../util/firebase.js';
import { FirebaseTokenRes } from '../types.js';

const router = express.Router();

router.post<{}, { idToken: string }, { refreshToken: string }>(
  '/refreshidtoken',
  async (req, res): Promise<void> => {
    const { refreshToken } = req.body;
    const newToken = await got
      .post(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
        json: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }
      })
      .json<FirebaseTokenRes>();
    res.json({ idToken: newToken.id_token });
  }
);

router.post<{}, {}, { idToken: string }>('/verifyidtoken', async (req, res): Promise<void> => {
  await firebase.auth().verifyIdToken(req.body.idToken);
  res.json();
});

export default router;
