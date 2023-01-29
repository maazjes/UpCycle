import jwt from 'jsonwebtoken';
import express from 'express';
import bcrypt from 'bcrypt';
import { SECRET } from '../util/config';
import { User } from '../models';

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

router.post<{}, LoginResponse, LoginBody>('/', async (
  req,
  res
): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: {
      username
    }
  });
  if (!user) {
    throw new Error('invalid username');
  }
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!passwordCorrect) {
    throw new Error('invalid password');
  }
  const userForToken = {
    username: user.username,
    id: user.id
  };
  const token = jwt.sign(userForToken, SECRET);
  res.status(200).json({ token, username: user.username, name: user.name });
});

export default router;
