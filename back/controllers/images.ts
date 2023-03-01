import express from 'express';
import { Image } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.delete<{ id: string }>('/:id', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('authentication required');
  }
  const { id } = req.params;
  const image = await Image.findOne({ where: { id } });
  if (!image) {
    throw new Error('image not found');
  }
  await image.destroy();
  res.status(204).send();
});

export default router;
