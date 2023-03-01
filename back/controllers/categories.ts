import express from 'express';
import { Category as SharedCategory } from '@shared/types.js';
import { Category } from '../models/index.js';

const router = express.Router();

router.get<{}, SharedCategory[]>('/', async (_req, res): Promise<void> => {
  const categories = await Category.findAll({});
  res.json(categories);
});

export default router;
