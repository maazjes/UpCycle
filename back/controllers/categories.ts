import express from 'express';
import { Category } from '../models';
import { Request, Response } from '../types';

const router = express.Router();

router.get('/', async (_req: Request<{}, {}, {}>, res: Response<Category[]>): Promise<void> => {
  const categories = await Category.findAll({});
  res.json(categories);
});

export default router;
