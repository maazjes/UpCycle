import express from 'express';
import multer from 'multer';
import { Op } from 'sequelize';
import { UserBase } from '@shared/types';
import { userExtractor } from '../util/middleware.js';
import {
  User, Post, Image, Follow
} from '../models/index.js';
import firebase from '../util/firebase.js';
import { uploadImage } from '../util/helpers.js';

const router = express.Router();
const upload = multer();

router.get<{}, User[], {}, { role: 'follower' | 'followed' }>('', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication requred');
  }
  const { role } = req.query;
  if (!role) {
    throw new Error('Parameter role required');
  }
  const where = role === 'followed'
    ? { followedId: req.user.id }
    : role === 'follower' ? { followerId: req.user.id }
      : {};

  const follows = await Follow.findAll({
    include: {
      model: User,
      where: { id: { [Op.ne]: req.user.id } }
    },
    where
  });
  res.json(follows as unknown as User[]);
});

router.get<{ id: string }, User>('/:id', userExtractor, async (req, res): Promise<void> => {
  const { id } = req.params;
  const include = {
    model: Post,
    attributes: { exclude: ['userId'] },
    include: [
      {
        model: Image,
        attributes: { exclude: ['postId'] }
      },
      {
        model: User,
        attributes: ['id']
      }
    ]
  };
  const user = await User.findOne({
    include,
    where: { id }
  });
  if (!user) {
    throw new Error('user not found');
  }
  if (req.user && req.user.id === id) {
    const { email } = await firebase.auth().getUser(id);
    if (!email) {
      throw new Error('user not found');
    }
    user.setDataValue('email', email);
  }
  res.json(user);
});

type NewUserBody = Omit<UserBase, 'id'> & { password: string };

type UserFields = Omit<NewUserBody, 'email' | 'password'> & { id: string };

router.post<{}, UserBase, NewUserBody>('/', upload.single('image'), async (req, res): Promise<void> => {
  const {
    email, displayName, password, bio, username
  } = req.body;
  const { uid } = await firebase.auth().createUser({ email, password });
  let userFields: UserFields = {
    id: uid, displayName, bio, username
  };
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    userFields = { ...userFields, photoUrl };
  }
  await User.create(userFields);
  res.json({
    ...userFields, email
  });
});

router.put<{}, UserBase, NewUserBody>('/', userExtractor, upload.single('image'), async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('invalid token');
  }
  const {
    email, displayName, password, bio, username
  } = req.body;
  const valuesToUpdate = { displayName, bio, username };
  await firebase.auth().updateUser(req.user.id, { email, password });
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    req.user.set({ photoUrl });
  }
  (Object.keys(valuesToUpdate) as (keyof typeof valuesToUpdate)[])
    .forEach((key): boolean => !valuesToUpdate[key] && delete valuesToUpdate[key]);
  req.user.set(valuesToUpdate);
  const user = await req.user.save();
  res.json({
    email, id: user.id, displayName, bio, photoUrl: user.photoUrl, username
  });
});

export default router;
