import express from 'express';
import multer from 'multer';
import {
  EmailUser,
  GetUsersQuery,
  SharedNewUserBody,
  User as SharedUser,
  UserBase
} from '@shared/types';
import { UpdateUserBody } from 'types.js';
import { UserBaseAttributes } from '../util/constants.js';
import { userExtractor } from '../util/middleware.js';
import { User, Follow } from '../models/index.js';
import firebase from '../util/firebase.js';
import { uploadProfileImage } from '../util/helpers.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage()
});

router.get<{}, UserBase[], {}, GetUsersQuery>('/', async (req, res): Promise<void> => {
  const { username } = req.query;
  const users = await User.findAll({
    where: { username: username.toLowerCase() },
    attributes: UserBaseAttributes
  });
  res.json(users);
});

router.get<{ id: string }, SharedUser>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const user = await User.findOne({
    where: { id },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });
  const followers = await Follow.count({ where: { followingId: id } });
  const following = await Follow.count({ where: { followerId: id } });
  const follow = await Follow.findOne({
    where: { followerId: req.userId!, followingId: id }
  });
  const followId = follow ? follow.id : null;
  if (!user) {
    throw new Error('Server error. Please try again.');
  }
  const { email } = await firebase.auth().getUser(user.id);
  res.json({
    ...user.dataValues,
    email: email!,
    followers,
    following,
    followId
  });
});

router.post<{}, EmailUser, SharedNewUserBody>(
  '/',
  upload.single('image'),
  async (req, res): Promise<void> => {
    const { displayName, password, bio, username, email } = req.body;
    const fbUser = await firebase.auth().getUserByEmail(email);
    await firebase.auth().updateUser(fbUser.uid, { password });
    const user = User.build({
      id: fbUser.uid,
      displayName,
      bio,
      username: username.toLowerCase()
    });
    if (req.file) {
      const uri = await uploadProfileImage(req.file);
      user.set({ photoUrl: uri });
    }
    try {
      await user.save();
    } catch (e) {
      firebase.auth().deleteUser(fbUser.uid);
      throw new Error('Username already exists.');
    }
    res.json({
      email: fbUser.email!,
      id: user.id,
      displayName: user.displayName,
      bio: user.bio,
      photoUrl: user.photoUrl,
      username: user.username
    });
  }
);

router.put<{ id: string }, EmailUser, UpdateUserBody>(
  '/:id',
  userExtractor,
  upload.single('image'),
  async (req, res): Promise<void> => {
    const { id } = req.params;
    if (req.userId !== id) {
      throw new Error('Server error. Please login again and retry.');
    }
    const user = await User.findOne({ where: { id: req.userId! } });
    if (!user) {
      throw new Error('Server error. Please login and retry.');
    }
    const { displayName, bio, username } = req.body;
    const valuesToUpdate = { displayName, bio, username };
    (Object.keys(valuesToUpdate) as (keyof typeof valuesToUpdate)[]).forEach(
      (key): boolean => !valuesToUpdate[key] && delete valuesToUpdate[key]
    );
    if (valuesToUpdate.username) {
      valuesToUpdate.username = valuesToUpdate.username.toLowerCase();
    }
    user.set(valuesToUpdate);
    if (req.file) {
      const uri = await uploadProfileImage(req.file);
      user.set({ photoUrl: uri });
    }
    const savedUser = await user.save();
    const fbUser = await firebase.auth().getUser(savedUser.id);
    res.json({
      email: fbUser.email!,
      id: savedUser.id,
      displayName: savedUser.displayName,
      bio: savedUser.bio,
      photoUrl: savedUser.photoUrl,
      username: savedUser.username
    });
  }
);

export default router;
