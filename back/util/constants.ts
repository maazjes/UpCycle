import { Category, User, Image } from '../models/index.js';
import { UserBaseKeys } from '../types.js';

export const UserBaseAttributes: UserBaseKeys = ['displayName', 'id', 'photoUrl', 'username'];

export const PostInclude = [
  {
    model: Category,
    order: ['depth', 'DESC'],
    attributes: ['name', 'id'],
    through: { attributes: [] }
  },
  { model: User, attributes: UserBaseAttributes },
  { model: Image, attributes: { exclude: ['postId'] } }
];

export const PostAttributes = { exclude: ['userId', 'categoryId'] };

export const PostBaseInclude = [{ model: Image, attributes: { exclude: ['postId'] } }];

export const PostBaseAttributes = ['id', 'title', 'price'];

export const CategoryInclude = {
  model: Category,
  as: 'subcategories',
  attributes: { exclude: ['parentCategoryId'] }
};
