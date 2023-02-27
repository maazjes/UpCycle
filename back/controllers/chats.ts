import express from 'express';
import { Chat, User } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.get<{}, {}, {}, { userId: string }>('/', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const chats = await Chat.findAll({
    include: [{
      model: User,
      as: 'creator'
    }, {
      model: User,
      as: 'user'
    }],
    attributes: { exclude: ['userId', 'creatorId'] },
    where: {}
  });
  res.json(chats);
});

export default router;
