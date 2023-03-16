import express from 'express';
import multer from 'multer';
import {
  EmailUser, SharedNewUserBody, SharedUpdateUserBody,
  User as SharedUser
} from '@shared/types';
import { userExtractor } from '../util/middleware.js';
import { User, Follow } from '../models/index.js';
import firebase from '../util/firebase.js';
import { uploadImage } from '../util/helpers.js';

const router = express.Router();
const upload = multer();

router.get<{ userId: string }, SharedUser>('/:userId', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('authentication required');
  }

  const { userId } = req.params;
  const user = await User.findOne({
    where: { id: userId },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  const followers = await Follow.count({ where: { followingId: userId } });
  const following = await Follow.count({ where: { followerId: userId } });
  const follow = await Follow.findOne({ where: { followerId: req.user.id, followingId: userId } });
  const followId = follow ? follow.id : null;

  if (!user) {
    throw new Error('user not found');
  }
  const { email } = await firebase.auth().getUser(user.id);
  res.json({
    ...user.dataValues, email: email!, followers, following, followId
  });
});

router.post<{}, EmailUser, SharedNewUserBody>('/', upload.single('image'), async (req, res): Promise<void> => {
  const {
    email, displayName, password, bio, username
  } = req.body;
  const fbUser = await firebase.auth().createUser({ email, password });
  const user = User.build({
    id: fbUser.uid, displayName, bio, username, photoUrl: ''
  });
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    user.set({ photoUrl });
  }
  await user.save();
  res.json({
    email: fbUser.email!,
    id: user.id,
    displayName: user.displayName,
    bio: user.bio,
    photoUrl: user.photoUrl,
    username: user.username
  });
});

router.put<{ userId: string }, EmailUser, SharedUpdateUserBody>('/:userId', userExtractor, upload.single('image'), async (req, res): Promise<void> => {
  const { userId } = req.params;
  if (!req.user || req.user.id !== userId) {
    throw new Error('authentication required');
  }
  const {
    email, displayName, password, bio, username
  } = req.body;
  const valuesToUpdate = { displayName, bio, username };
  const fbUser = await firebase.auth().updateUser(req.user.id, { email, password });
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    req.user.set({ photoUrl });
  }
  (Object.keys(valuesToUpdate) as (keyof typeof valuesToUpdate)[])
    .forEach((key): boolean => !valuesToUpdate[key] && delete valuesToUpdate[key]);
  req.user.set(valuesToUpdate);
  const user = await req.user.save();
  res.json({
    email: fbUser.email!,
    id: user.id,
    displayName: user.displayName,
    bio: user.bio,
    photoUrl: user.photoUrl,
    username: user.username
  });
});

export default router;
