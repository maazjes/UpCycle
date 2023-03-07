import express from 'express';
import { Follow as SharedFollow, FollowerPage, FollowingPage } from '@shared/types.js';
import { Follow, User } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { GetFollowsQuery } from '../types.js';
import { UserBaseAttributes } from '../util/constants.js';

const router = express.Router();

router.post<{}, SharedFollow, { userId: string }>('', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const { userId } = req.body;
  const follow = await Follow.create({ followerId: req.user.id, followingId: userId });
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
  res.status(204).send();
});

router.get<{ userId: string }, FollowerPage, {}, GetFollowsQuery>('/:userId/followers', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const { limit, offset } = req.query;
  const { userId } = req.params;
  const follows = await Follow.findAndCountAll({
    include: {
      model: User,
      as: 'follower',
      attributes: UserBaseAttributes
    },
    limit: Number(limit),
    offset: Number(offset),
    where: { followerId: userId },
    attributes: ['id', 'followerId']
  });
  res.json({
    totalItems: follows.count,
    offset: Number(offset),
    data: follows.rows
  } as FollowerPage);
});

router.get<{ userId: string }, FollowingPage, {}, GetFollowsQuery>('/:userId/followings', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const { userId } = req.params;
  const { limit, offset } = req.query;
  const follows = await Follow.findAndCountAll({
    include: {
      model: User,
      as: 'following',
      attributes: UserBaseAttributes

    },
    limit: Number(limit),
    offset: Number(offset),
    where: { followingId: userId },
    attributes: ['id', 'followerId']
  });
  res.json({
    totalItems: follows.count,
    offset: Number(offset),
    data: follows.rows
  } as FollowingPage);
});

export default router;
