import express from 'express';
import bcrypt from 'bcrypt';
import { User, Post } from '../models';
import { Request, Response } from '../types';

const router = express.Router();

router.get('/', async (_req: Request<{}, {}, {}>, res: Response<User[]>): Promise<void> => {
  const users = await User.findAll({
    include: {
      model: Post,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(users);
});

router.get('/:id', async (req: Request<{}, {}, {}>, res: Response<User>): Promise<void> => {
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

router.post('/', async (req: Request<{}, {}, { username: string; name: string; password: string }>, res: Response<User>): Promise<void> => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.create({ username, name, passwordHash });
  res.json(user);
});

export default router;
