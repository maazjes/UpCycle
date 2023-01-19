import { Response } from 'express';
import { TypedRequestBody } from '../types';
import upload from '../util/multer';
import { Post, User } from '../models';
import { tokenExtractor } from '../util/middleware';

const router = require('express').Router();

router.get('/', async (_req: TypedRequestBody<null>, res: Response): Promise<void> => {
  const posts = await Post.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  });
  res.json(posts);
});

router.post('/', upload.single('img'), tokenExtractor, async (req: TypedRequestBody<{ title: string; price: string; img: File }>, res: Response): Promise<void> => {
  // @ts-ignore
  const user = await User.findByPk(req.decodedToken.id);
  if (user) {
    const post = await Post.create({
      ...req.body,
      userId: user.id,
      // @ts-ignore
      imageUrl: req.file?.location
    });
    res.json(post);
  }
  res.status(401).json({ error: 'invalid token' });
});

export default router;
