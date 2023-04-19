import express from 'express';
import { Op } from 'sequelize';
import { Message as SharedMessage, NewMessageBody, MessagePage } from '@shared/types.js';
import multer from 'multer';
import ChatInfo from '../models/chatInfo.js';
import { saveImages, uploadMessageImages } from '../util/helpers.js';
import { Chat, Message, Image } from '../models/index.js';
import { GetMessagesQuery } from '../types.js';

const router = express.Router();
const upload = multer();

router.post<{}, SharedMessage, NewMessageBody>(
  '/',
  upload.array('images'),
  async (req, res): Promise<void> => {
    const { receiverId, text } = req.body;
    const [chat, created] = await Chat.findOrCreate({
      where: {
        [Op.or]: [
          { userId: req.userId!, creatorId: receiverId },
          { userId: receiverId, creatorId: req.userId! }
        ]
      },
      defaults: { creatorId: req.userId!, userId: receiverId }
    });
    if (created) {
      await ChatInfo.create({
        chatId: chat.id,
        userId: req.userId!,
        archived: false
      });
    }
    const message = await Message.create({
      text,
      chatId: chat.id,
      receiverId,
      senderId: req.userId!
    });
    await chat.update({ lastMessageId: message.id });
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadMessageImages(req.files);
      const images = await saveImages(imageUrls, undefined, message.id);
      message.setDataValue('images', images);
    }
    res.json(message as SharedMessage);
  }
);

router.get<{}, MessagePage, {}, GetMessagesQuery>('/', async (req, res): Promise<void> => {
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
});

export default router;
