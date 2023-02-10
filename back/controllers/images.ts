import express from 'express';
import { Image } from '../models/index.js';

const router = express.Router();

router.delete<{ id: string }, Image>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const image = await Image.findOne({ where: { id } });
  if (!image) {
    throw new Error('image not found');
  }
  await image.destroy();
  res.json(image);
});

export default router;
