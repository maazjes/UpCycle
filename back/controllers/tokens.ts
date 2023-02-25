import express from 'express';
import { userExtractor } from '../util/middleware.js';
import firebase from '../util/firebase.js';

const router = express.Router();

router.get('/', userExtractor, async (req, res): Promise<void> => {
  await firebase.auth().revokeRefreshTokens(req.user.id);
  res.json();
});

export default router;
