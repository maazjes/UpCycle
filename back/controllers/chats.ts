import express from 'express';
import { ChatPage, Chat as SharedChat } from '@shared/types.js';
import { Op } from 'sequelize';
import { PaginationQuery } from '../types';
import { UserBaseAttributes } from '../util/constants.js';
import { Chat, Message, User, Image, ChatInfo } from '../models/index.js';

const router = express.Router();

router.get<{}, ChatPage, {}, PaginationQuery>('/', async (req, res): Promise<void> => {
  const { limit, offset } = req.query;
  const { rows, count } = await Chat.findAndCountAll({
    include: [
      {
        model: User,
        as: 'creator',
        attributes: UserBaseAttributes
      },
      {
        model: User,
        as: 'user',
        attributes: UserBaseAttributes
      },
      {
        model: Message,
        include: [{ model: Image, attributes: ['id'] }],
        as: 'lastMessage'
      },
      {
        model: ChatInfo,
        attributes: ['id', 'archived'],
        as: 'info'
      }
    ],
    attributes: ['id'],
    limit: Number(limit),
    offset: Number(offset),
    where: { [Op.or]: [{ creatorId: req.userId! }, { userId: req.userId! }] }
  });
  res.json({
    totalItems: count,
    offset: Number(offset),
    data: rows
  } as ChatPage);
});

router.get<{ id: string }, SharedChat>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const chat = await Chat.findOne({
    include: [
      {
        model: User,
        as: 'creator',
        attributes: UserBaseAttributes
      },
      {
        model: User,
        as: 'user',
        attributes: UserBaseAttributes
      },
      {
        model: Message,
        include: [{ model: Image, attributes: ['id'] }],
        as: 'lastMessage'
      },
      {
        model: ChatInfo,
        attributes: ['id', 'archived'],
        as: 'info'
      }
    ],
    attributes: ['id'],
    where: { id }
  });
  if (!chat) {
    throw new Error('Server error. Please try again.');
  }
  res.json(chat as SharedChat);
});

export default router;
