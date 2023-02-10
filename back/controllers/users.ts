import express from 'express';
import { userExtractor } from '../util/middleware.js';
import { UserBase } from '../types.js';
import { User, Post, Image } from '../models/index.js';
import firebase from '../util/firebase.js';
import upload from '../util/multer.js';

const router = express.Router();

router.get<{}, User[], {}, { userId: string; postId: string }>('/', userExtractor, async (req, res): Promise<void> => {
  console.log(req.user);
  console.log(req.query);
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
  res.json(users);
});

interface NewUserBody {
  email: string;
  displayName: string;
  password: string;
  bio?: string;
}

router.post<{}, UserBase, NewUserBody>('/', upload.single('image'), async (req, res): Promise<void> => {
  const {
    email, displayName, password, bio
  } = req.body;
  const firebaseUser = await firebase.auth().createUser({ email, password });
  const user = await User.create({
    id: firebaseUser.uid, displayName, bio, photoUrl: req.file?.location
  });
  res.json({
    email, id: user.id, displayName, bio, photoUrl: user.photoUrl
  });
});

export default router;
