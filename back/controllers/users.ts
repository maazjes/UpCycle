import express from 'express';
import multer from 'multer';
import { EmailUser, SharedNewUserBody, User as SharedUser } from '@shared/types';
import { UpdateUserBody } from 'types.js';
import { userExtractor } from '../util/middleware.js';
import { User, Follow } from '../models/index.js';
import firebase from '../util/firebase.js';
import { uploadImage } from '../util/helpers.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage()
});

router.get<{ userId: string }, SharedUser>(
  '/:userId',
  userExtractor,
  async (req, res): Promise<void> => {
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
    const follow = await Follow.findOne({
      where: { followerId: req.user.id, followingId: userId }
    });
    const followId = follow ? follow.id : null;

    if (!user) {
      throw new Error('user not found');
    }
    const { email } = await firebase.auth().getUser(user.id);
    res.json({
      ...user.dataValues,
      email: email!,
      followers,
      following,
      followId
    });
  }
);

router.post<{}, EmailUser, SharedNewUserBody>(
  '/',
  upload.single('image'),
  async (req, res): Promise<void> => {
    const { displayName, password, bio, username, email } = req.body;
    console.log(email);
    const { uid } = await firebase.auth().getUserByEmail(email);
    console.log(uid);
    await firebase.auth().updateUser(uid, { password });
    const user = User.build({
      id: uid,
      displayName,
      bio,
      username,
      email
    });
    if (req.file) {
      const uri = await uploadImage(req.file, Date.now(), { width: 100, height: 100 });
      user.set({ photoUrl: uri });
    }
    try {
      await user.save();
    } catch (e) {
      console.log(e);
      firebase.auth().deleteUser(uid);
      throw new Error('Username already exists');
    }
    res.json({
      email,
      id: user.id,
      displayName: user.displayName,
      bio: user.bio,
      photoUrl: user.photoUrl,
      username: user.username
    });
  }
);

router.put<{ userId: string }, EmailUser, UpdateUserBody>(
  '/:userId',
  userExtractor,
  upload.single('image'),
  async (req, res): Promise<void> => {
    const { userId } = req.params;
    if (!req.user || req.user.id !== userId) {
      throw new Error('authentication required');
    }
    const { email, displayName, password, bio, username } = req.body;
    const valuesToUpdate = { displayName, bio, username };
    const fbUser = await firebase.auth().updateUser(req.user.id, { email, password });
    (Object.keys(valuesToUpdate) as (keyof typeof valuesToUpdate)[]).forEach(
      (key): boolean => !valuesToUpdate[key] && delete valuesToUpdate[key]
    );
    req.user.set(valuesToUpdate);
    if (req.file) {
      const uri = await uploadImage(req.file, Date.now(), { width: 100, height: 100 });
      req.user.set({ photoUrl: uri });
    }
    const user = await req.user.save();
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

export default router;
