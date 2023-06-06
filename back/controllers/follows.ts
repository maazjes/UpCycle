import express from 'express';
import { Follow as SharedFollow, FollowPage, RawFollow, NewFollowBody } from '@shared/types.js';
import { Follow, User } from '../models/index.js';
import { GetFollowsQuery } from '../types.js';
import { UserBaseAttributes } from '../util/constants.js';

const router = express.Router();

router.post<{}, RawFollow, NewFollowBody>('/follows', async (req, res): Promise<void> => {
  const { userId } = req.body;
  const follow = await Follow.create({ followerId: req.userId!, followingId: userId });
  if (!follow) {
    throw new Error('Server error. Please try again.');
  }
  res.json(follow);
});

router.delete<{ id: string }, {}>('/follows/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const follow = await Follow.findOne({ where: { id } });
  if (!follow) {
    throw new Error('Server error. Please try again.');
  }
  if (req.userId! !== follow.followerId) {
    throw new Error('Server error. Please login again and retry.');
  }
  await follow.destroy();
  res.status(204).send();
});

router.get<{ id: string }, FollowPage, {}, GetFollowsQuery>(
  '/users/:id/followers',
  async (req, res): Promise<void> => {
    const { limit, offset } = req.query;
    const { id } = req.params;
    const follows = await Follow.findAndCountAll({
      include: {
        model: User,
        as: 'follower',
        attributes: UserBaseAttributes,
        include: [
          {
            model: Follow,
            as: 'followers',
            attributes: ['id'],
            where: { followerId: req.userId! },
            required: false
          }
        ]
      },
      limit: Number(limit),
      offset: Number(offset),
      where: { followingId: id },
      attributes: ['id']
    });
    const finalFollows = follows.rows.map((follow): SharedFollow => {
      const finalFollow = { ...follow.dataValues, user: follow.dataValues.follower! };
      delete finalFollow.follower;
      return finalFollow;
    });
    res.json({
      totalItems: follows.count,
      offset: Number(offset),
      data: finalFollows
    });
  }
);

router.get<{ id: string }, FollowPage, {}, GetFollowsQuery>(
  '/users/:id/following',
  async (req, res): Promise<void> => {
    const { id } = req.params;
    const { limit, offset } = req.query;
    const follows = await Follow.findAndCountAll({
      include: {
        model: User,
        as: 'following',
        attributes: UserBaseAttributes,
        include: [
          {
            model: Follow,
            as: 'followers',
            attributes: ['id'],
            where: { followerId: req.userId! }
          }
        ]
      },
      limit: Number(limit),
      offset: Number(offset),
      where: { followerId: id },
      attributes: ['id']
    });
    const finalFollows = follows.rows.map((follow): SharedFollow => {
      const finalFollow = { ...follow.dataValues, user: follow.dataValues.following! };
      delete finalFollow.following;
      return finalFollow;
    });
    res.json({
      totalItems: follows.count,
      offset: Number(offset),
      data: finalFollows
    });
  }
);

export default router;
