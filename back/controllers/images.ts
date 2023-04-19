import express from 'express';
import { Image } from '../models/index.js';

const router = express.Router();

router.delete<{ id: string }>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const image = await Image.findOne({ where: { id } });
  if (!image) {
    throw new Error('Server error. Please try again.');
  }
  await image.destroy();
  res.status(204).send();
});

export default router;
