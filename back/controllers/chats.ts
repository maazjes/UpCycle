import express from 'express';
import { ChatPage } from '@shared/types.js';
import { Op } from 'sequelize';
import { PaginationQuery } from '../types';
import { UserBaseAttributes } from '../util/constants.js';
import { Chat, Message, User, Image, ChatInfo } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.get<{}, ChatPage, {}, PaginationQuery>(
  '/',
  userExtractor,
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }
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
      where: { [Op.or]: [{ creatorId: req.user.id }, { userId: req.user.id }] }
    });
    res.json({
      totalItems: count,
      offset: Number(offset),
      data: rows
    } as ChatPage);
  }
);

export default router;
