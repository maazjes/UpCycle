import { RawChatInfo, UpdateChatInfoBody } from '@shared/types';
import express from 'express';
import { userExtractor } from '../util/middleware.js';
import { ChatInfo } from '../models/index.js';

const router = express.Router();

router.put<{ id: string }, RawChatInfo, UpdateChatInfoBody>(
  '/:id',
  userExtractor,
  async (req, res): Promise<void> => {
    console.log(req.body);
    const { id } = req.params;
    const { archived } = req.body;
    if (!archived) {
      throw new Error('asd');
    }
    if (!req.user) {
      throw new Error('asd');
    }
    const chatInfo = await ChatInfo.findOne({ where: { id } });
    console.log(chatInfo);
    if (!chatInfo) {
      throw new Error('asd');
    }
    const savedChatInfo = await chatInfo.update({ archived });
    res.json(savedChatInfo);
  }
);

export default router;
