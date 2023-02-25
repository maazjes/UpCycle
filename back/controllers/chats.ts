import express from 'express';
import { Chat, User } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.get<{}, {}, {}, { userId: string }>('/', userExtractor, async (_req, res): Promise<void> => {
  const chats = await Chat.findAll({
    include: [{
      model: User,
      as: 'creator'
    }, {
      model: User,
      as: 'user'
    }],
    attributes: { exclude: ['userId', 'creatorId'] }
  });
  res.json(chats);
});

export default router;
