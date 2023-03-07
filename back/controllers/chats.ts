import express from 'express';
import { ChatPage, Chat as SharedChat } from '@shared/types.js';
import { Op } from 'sequelize';
import { PaginationQuery } from '../types';
import { UserBaseAttributes } from '../util/constants.js';
import { Chat, User } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.get<{}, ChatPage, {}, PaginationQuery>('/', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('Authentication required');
  }
  const { limit, offset } = req.query;
  const chats = await Chat.findAndCountAll({
    include: [{
      model: User,
      as: 'creator',
      attributes: UserBaseAttributes
    }, {
      model: User,
      as: 'user',
      attributes: UserBaseAttributes
    }],
    attributes: ['id', 'lastMessage'],
    limit: Number(limit),
    offset: Number(offset),
    where: { [Op.or]: [{ creatorId: req.user.id }, { userId: req.user.id }] }
  });
  const finalChats = chats.rows.map((chat): SharedChat => {
    const user = req.user!.id === chat.dataValues.creator!.id
      ? chat.dataValues.user!
      : chat.dataValues.creator!;
    const chatValues = { ...chat.dataValues, user };
    delete chatValues.creator;
    return chatValues;
  });
  res.json({ totalItems: chats.count, offset: Number(offset), data: finalChats });
});

export default router;
