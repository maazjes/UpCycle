import express from 'express';
import { Op } from 'sequelize';
import { Message as SharedMessage, MessageBody, MessagePages } from '@shared/types.js';
import { Chat, Message } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { getPagination, getPagingData } from '../util/helpers.js';
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

router.get<{}, MessagePages, {}, GetMessagesQuery>('/', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const {
    page, size, userId1, userId2
  } = req.query;
  const { limit, offset } = getPagination(Number(page), Number(size));
  const messages = await Message.findAndCountAll(
    {
      limit,
      offset,
      where: {
        [Op.or]: [{ senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }]
      },
      order: [['createdAt', 'DESC']]
    }
  );
  const pagination = getPagingData(messages.count, Number(page), limit);
  res.json({ ...pagination, messages: messages.rows });
});

export default router;
