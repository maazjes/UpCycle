import express from 'express';
import multer from 'multer';
import { userExtractor } from '../util/middleware.js';
import { UserBase } from '../types.js';
import { User, Post, Image } from '../models/index.js';
import firebase from '../util/firebase.js';
import { uploadImage } from '../util/helpers.js';

const router = express.Router();
const upload = multer();

interface ExtendedUser {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  bio?: string;
}

router.get<{}, User[] | ExtendedUser[], {}, { userId: string; postId: string }>('/', userExtractor, async (req, res): Promise<void> => {
  const { userId } = req.query;
  const where = userId ? { id: userId } : {};
  const include = req.user ? {
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
    ],
    as: 'favorites',
    through: {
      attributes: { exclude: ['id', 'postId', 'userId'] }
    }
  } : {
    model: Post,
    attributes: { exclude: ['userId'] }
  };
  const users = await User.findAll({
    include,
    where
  });
  if (userId && users) {
    const { email } = await firebase.auth().getUser(userId);
    if (!email) {
      throw new Error('user not found');
    }
    const {
      id, displayName, photoUrl, bio
    } = users[0];
    res.json([{
      email, id, displayName, photoUrl, bio
    }]);
    return;
  }
  res.json(users);
});

interface NewUserBody {
  email: string;
  displayName: string;
  password: string;
  bio?: string;
  photoUrl?: string;
}

type UserFields = Omit<NewUserBody, 'email' | 'password'> & { id: string };

router.post<{}, UserBase, NewUserBody>('/', upload.single('image'), async (req, res): Promise<void> => {
  const {
    email, displayName, password, bio
  } = req.body;
  const firebaseUser = await firebase.auth().createUser({ email, password });
  let userFields: UserFields = { id: firebaseUser.uid, displayName, bio };
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
    email, displayName, password, bio
  } = req.body;
  await firebase.auth().updateUser(req.user.id, { email, password });
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    req.user.photoUrl = photoUrl;
  }
  const user = await req.user.update({ displayName, bio });
  res.json({
    email, id: user.id, displayName, bio, photoUrl: user.photoUrl
  });
});

export default router;
