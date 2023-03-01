import express from 'express';
import { Chat as SharedChat } from '@shared/types.js';
import { Chat, User } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.get<{}, SharedChat[]>('/', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const include = ['id', 'displayName', 'username', 'photoUrl'];
  const chats = await Chat.findAll({
    include: [{
      model: User,
      as: 'creator',
      include
    }, {
      model: User,
      as: 'user',
      include
    }],
    attributes: ['id'],
    where: {}
  });
  res.json(chats as SharedChat[]);
});

export default router;
