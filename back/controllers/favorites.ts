import express from 'express';
import { Favorite, User } from '../models';
import { tokenExtractor } from '../util/middleware';

const router = express.Router();

router.post<{}, Favorite, { postId: number; }>('', tokenExtractor, async (req, res): Promise<void> => {
  const user = await User.findByPk(req.decodedToken?.id);
  if (!user) {
    throw new Error('user not found');
  }
  const { postId } = req.body;
  console.log(req.body)
  const favorite = await Favorite.create({ postId, userId: user.id });
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
  const asd = await favorite.destroy();
  console.log(asd)
  res.json(favorite);
});

export default router;
