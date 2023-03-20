import express from 'express';
import { Favorite as SharedFavorite } from '@shared/types.js';
import { Favorite } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';

const router = express.Router();

router.post<{}, SharedFavorite, { postId: number }>(
  '/',
  userExtractor,
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('invalid token');
    }
    const { postId } = req.body;
    const favorite = await Favorite.create({ postId, userId: req.user.id });
    if (!favorite) {
      throw new Error('creating favorite failed');
    }
    res.json(favorite);
  }
);

router.delete<{ id: string }>(
  '/:id',
  userExtractor,
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const { id } = req.params;
    const favorite = await Favorite.findOne({ where: { id } });
    if (!favorite) {
      throw new Error('couldnt find favorite by id');
    }
    if (favorite.userId !== req.user.id) {
      throw new Error('Authentication required');
    }
    await favorite.destroy();
    res.status(204).send();
  }
);

export default router;
