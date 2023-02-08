import express from 'express';
import bcrypt from 'bcrypt';
import { tokenExtractor } from '../util/middleware';
import { User, Post, Image } from '../models';

const router = express.Router();

router.get<{}, User[], {}, { userId: string; postId: string }>('/', tokenExtractor, async (req, res): Promise<void> => {
  if (req.decodedToken?.id) {
    const user = await User.findByPk(req.decodedToken?.id);
    if (!user) {
      throw new Error('user not found');
    }
  }
  const { userId } = req.query;
  const where = userId ? { id: userId } : {};
  const include = req.decodedToken ? {
    model: Post,
    attributes: { exclude: ['userId'] },
    include: [
      {
        model: Image,
        attributes: { exclude: ['postId'] }
      },
      {
        model: User,
        attributes: ['id', 'username']
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
  username: string;
  name: string;
  password: string;
}

router.post<{}, User, NewUserBody>('/', async (req, res): Promise<void> => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ username, name, passwordHash });
  res.json(user);
});

export default router;
