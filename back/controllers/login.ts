import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import { SECRET } from '../util/config';
import { User } from '../models';
import { ErrorResponse } from '../types';

const router = express.Router();

interface LoginResponse {
  token: string;
  username: string;
  name: string;
}

interface LoginBody {
  username: string;
  password: string;
}

router.post<{}, LoginResponse | ErrorResponse, LoginBody>('/', async (
  req,
  res
): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: {
      username
    }
  });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!user || !passwordCorrect) {
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
