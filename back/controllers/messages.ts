import express from 'express';
import { Op } from 'sequelize';
import { Message as SharedMessage, NewMessageBody, MessagePage } from '@shared/types.js';
import multer from 'multer';
import ChatInfo from '../models/chatInfo.js';
import { saveImages, uploadPostImages } from '../util/helpers.js';
import { Chat, Message, Image } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { GetMessagesQuery } from '../types.js';

const router = express.Router();
const upload = multer();

router.post<{}, SharedMessage, NewMessageBody>(
  '/',
  upload.array('images'),
  userExtractor,
  async (req, res): Promise<void> => {
    const { user } = req;
    if (!user) {
      throw new Error('Authentication required');
    }
    const { receiverId, text } = req.body;
    const [chat, created] = await Chat.findOrCreate({
      where: {
        [Op.or]: [
          { userId: user.id, creatorId: receiverId },
          { userId: receiverId, creatorId: user.id }
        ]
      },
      defaults: { creatorId: user.id, userId: receiverId }
    });
    if (created) {
      await ChatInfo.create({
        chatId: chat.id,
        userId: user.id,
        archived: false
      });
    }
    const message = await Message.create({
      text,
      chatId: chat.id,
      receiverId,
      senderId: user.id
    });
    await chat.update({ lastMessageId: message.id });
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadPostImages(req.files);
      const images = await saveImages(imageUrls, undefined, message.id);
      message.setDataValue('images', images);
    }
    res.json(message as SharedMessage);
  }
);

router.get<{}, MessagePage, {}, GetMessagesQuery>(
  '/',
  userExtractor,
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const { limit, offset, userId1, userId2 } = req.query;
    const messages = await Message.findAndCountAll({
      limit: Number(limit),
      offset: Number(offset),
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      order: [['createdAt', 'DESC']],
      include: Image
    });
    res.json({
      totalItems: messages.count,
      offset: Number(offset),
      data: messages.rows
    } as MessagePage);
  }
);

export default router;
