import express from 'express';
import { Op } from 'sequelize';
import { Message as SharedMessage, MessageBody, MessagePage } from '@shared/types.js';
import { Chat, Message } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { GetMessagesQuery } from '../types.js';

const router = express.Router();

router.post<{}, SharedMessage, MessageBody>('/', userExtractor, async (req, res): Promise<void> => {
  const { user } = req;
  if (!user) {
    throw new Error('Authentication required');
  }
  const { receiverId, content } = req.body;
  const [chat] = await Chat.findOrCreate({
    where: {
      [Op.or]: [{ userId: user.id, creatorId: receiverId },
        { userId: receiverId, creatorId: user.id }]
    },
    defaults: { creatorId: user.id, userId: receiverId, lastMessage: content }
  });
  if (chat.lastMessage !== content) {
    await chat.update({ lastMessage: content });
  }
  const message = await Message.create({
    content, chatId: chat.id, receiverId, senderId: user.id
  });
  res.json(message);
});

router.get<{}, MessagePage, {}, GetMessagesQuery>('/', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const {
    limit, offset, userId1, userId2
  } = req.query;
  const messages = await Message.findAndCountAll(
    {
      limit: Number(limit),
      offset: Number(offset),
      where: {
        [Op.or]: [{ senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }]
      },
      order: [['createdAt', 'DESC']]
    }
  );
  res.json({ totalItems: messages.count, offset: Number(offset), data: messages.rows });
});

export default router;
