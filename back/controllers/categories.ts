import express from 'express';
import { Category } from '../models/index.js';

const router = express.Router();

router.get<{}, Category[]>('/', async (_req, res): Promise<void> => {
  const categories = await Category.findAll({});
  res.json(categories);
});

export default router;
