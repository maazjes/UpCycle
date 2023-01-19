import express from 'express';
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

router.post('/', async (req: Request<{}, {}, { username: string; name: string }>, res: Response<User>): Promise<void> => {
  const user = await User.create(req.body);
  res.json(user);
});

export default router;
