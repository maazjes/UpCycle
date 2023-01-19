import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';
import { User } from '../models';

const router = require('express').Router();

// @ts-ignore
router.post('/', async (req, res): void => {
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
  }
  const userForToken = {
    username: user.username,
    id: user.id
  };
  const token = jwt.sign(userForToken, SECRET);
  res.status(200).send({ token, username: user.username, name: user.name });
});

export default router;
