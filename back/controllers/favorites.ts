import express from 'express';
import { Favorite } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.post<{}, Favorite, { postId: number }>('', userExtractor, async (req, res): Promise<void> => {
  if (!req.user) {
    throw new Error('invalid token');
  }
  const { postId } = req.body;
  const favorite = await Favorite.create({ postId, userId: req.user.id });
  if (!favorite) {
    throw new Error('creating favorite failed');
  }
  res.json(favorite);
});

router.delete <{ id: string }, Favorite>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const favorite = await Favorite.findOne({ where: { id } });
  if (!favorite) {
    throw new Error('couldnt find favorite by id');
  }
  await favorite.destroy();
  res.json(favorite);
});

export default router;
