import express from 'express';
import bcrypt from 'bcrypt';
import { User, Post } from '../models';

const router = express.Router();

router.get<{}, User[]>('/', async (_req, res): Promise<void> => {
  const users = await User.findAll({
    include: {
      model: Post,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(users);
});

router.get <{ id: string }, User>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const where = id ? { id } : {};
  const user = await User.findOne({
    include: {
      model: Post,
      attributes: { exclude: ['userId'] }
    },
    where
  });
  if (!user) {
    return;
  }
  res.json(user);
});

interface NewUserBody {
  username: string;
  name: string;
  password: string;
}

router.post <{}, User, NewUserBody>('/', async (req, res): Promise<void> => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ username, name, passwordHash });
  res.json(user);
});

export default router;
