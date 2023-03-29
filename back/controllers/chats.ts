import express from 'express';
import { ChatPage, Chat as SharedChat, UpdateChatBody } from '@shared/types.js';
import { Op } from 'sequelize';
import { PaginationQuery } from '../types';
import { UserBaseAttributes } from '../util/constants.js';
import { Chat, Message, User, Image } from '../models/index.js';
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
    const chats = await Chat.findAndCountAll({
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
        }
      ],
      attributes: ['id', 'archived'],
      limit: Number(limit),
      offset: Number(offset),
      where: { [Op.or]: [{ creatorId: req.user.id }, { userId: req.user.id }] }
    });
    const finalChats = chats.rows.map((chat): SharedChat => {
      const user =
        req.user!.id === chat.dataValues.creator!.id
          ? chat.dataValues.user!
          : chat.dataValues.creator!;
      const chatValues = { ...chat.dataValues, user };
      delete chatValues.creator;
      return chatValues as SharedChat;
    });
    res.json({
      totalItems: chats.count,
      offset: Number(offset),
      data: finalChats
    });
  }
);

router.put<{ chatId: string }, Chat, UpdateChatBody>(
  '/:chatId',
  userExtractor,
  async (req, res): Promise<void> => {
    const { chatId } = req.params;
    if (!req.user) {
      throw new Error('asd');
    }
    const chat = await Chat.findOne({
      where: { id: chatId }
    });
    if (!chat) {
      throw new Error('Porlbme');
    }
    if (chat.userId !== req.user.id && chat.creatorId !== req.user.id) {
      throw new Error('not authorized');
    }
    const savedChat = await chat.update({ archived: req.body.archived });
    res.json(savedChat);
  }
);

export default router;
