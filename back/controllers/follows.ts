import express from 'express';
import { Follow } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.post<{}, Follow, { userId: string }>('', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const { userId } = req.body;
  const follow = await Follow.create({ followerId: req.user.id, followedId: userId });
  if (!follow) {
    throw new Error('creating follow failed');
  }
  res.json(follow);
});

router.delete <{ id: string }, {}>('/:id', async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const { id } = req.params;
  const follow = await Follow.findOne({ where: { id } });
  if (!follow) {
    throw new Error('couldnt find favorite by id');
  }
  if (req.user.id !== follow.followerId) {
    throw new Error('Authentication required');
  }
  await follow.destroy();
  res.status(200).send();
});

export default router;
