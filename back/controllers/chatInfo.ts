import { RawChatInfo, UpdateChatInfoBody } from '@shared/types';
import express from 'express';
import { ChatInfo } from '../models/index.js';

const router = express.Router();

router.put<{ id: string }, RawChatInfo, UpdateChatInfoBody>(
  '/:id',
  async (req, res): Promise<void> => {
    const { id } = req.params;
    const { archived } = req.body;
    const chatInfo = await ChatInfo.findOne({ where: { id } });
    if (!chatInfo) {
      throw new Error('Server error. Please try again.');
    }
    const savedChatInfo = await chatInfo.update({ archived });
    res.json(savedChatInfo);
  }
);

export default router;
