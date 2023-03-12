import express from 'express';
import { Category as SharedCategory } from '@shared/types.js';
import { Category } from '../models/index.js';

const router = express.Router();

router.get<{}, SharedCategory[]>('/', async (_req, res): Promise<void> => {
  const categories = await Category.findAll({
    include: [{
      model: Category,
      as: 'subcategories',
      attributes: { exclude: ['parentCategoryId'] },
      include: [{
        model: Category,
        as: 'subcategories',
        attributes: { exclude: ['parentCategoryId'] },
        include: [{
          model: Category,
          as: 'subcategories',
          attributes: { exclude: ['parentCategoryId'] }
        }]
      }]
    }],
    attributes: { exclude: ['parentCategoryId'] },
    where: { parentCategoryId: null }
  });
  res.json(categories as SharedCategory[]);
});

export default router;
