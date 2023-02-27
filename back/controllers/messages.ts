import express from 'express';
import { Op } from 'sequelize';
import { Chat, Message } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { getPagination, getPagingData } from '../util/helpers.js';
import { PaginationBase } from '../types.js';

const router = express.Router();

interface MessageBody {
  receiverId: string;
  content: string;
}

router.post<{}, Message, MessageBody>('/', userExtractor, async (req, res): Promise<void> => {
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

type GetMessagesQuery = {
  page: string;
  size: string;
  userId1: string;
  userId2: string;
};

interface MessagesResponse extends PaginationBase {
  messages: Message[];
}

router.get<{}, MessagesResponse, {}, GetMessagesQuery>('/', userExtractor, async (req, res): Promise<void> => {
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
