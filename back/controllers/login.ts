import jwt from 'jsonwebtoken';
import express from 'express';
import { SECRET } from '../util/config';
import { User } from '../models';
import { Request, Response } from '../types';

const router = express.Router();

router.post('/', async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response<{ error: string } | { token: string; username: string; name: string }>
): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: {
      username
    }
  });
  const passwordCorrect = password === 'salainen';
  if (!(user && passwordCorrect)) {
    res.status(401).json({
      error: 'invalid username or password'
    });
    return;
  }
  const userForToken = {
    username: user.username,
    id: user.id
  };
  const token = jwt.sign(userForToken, SECRET);
  res.status(200).json({ token, username: user.username, name: user.name });
});

export default router;
