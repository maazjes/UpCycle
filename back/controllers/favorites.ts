import express from 'express';
import { Favorite as SharedFavorite } from '@shared/types.js';
import { Favorite } from '../models/index.js';

const router = express.Router();

router.post<{}, SharedFavorite, { postId: number }>('/', async (req, res): Promise<void> => {
  const { postId } = req.body;
  const favorite = await Favorite.create({ postId, userId: req.userId! });
  res.json(favorite);
});

router.delete<{ id: string }>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const favorite = await Favorite.findOne({ where: { id } });
  if (!favorite) {
    throw new Error('Server error. Please try again.');
  }
  if (favorite.userId !== req.userId!) {
    throw new Error('Sever error. Please login again and retry.');
  }
  await favorite.destroy();
  res.status(204).send();
});

export default router;
