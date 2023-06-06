import { Category, User, Image } from '../models/index.js';

export const UserBaseAttributes = ['displayName', 'id', 'photoUrl', 'username'];

export const PostInclude = [
  {
    model: Category,
    order: ['depth', 'DESC'],
    attributes: ['name', 'id'],
    through: { attributes: [] }
  },
  { model: User, attributes: UserBaseAttributes },
  { model: Image, order: ['uri', 'ASC'], attributes: { exclude: ['postId'] } }
];

export const PostAttributes = { exclude: ['userId', 'categoryId'] };

export const PostBaseInclude = [{ model: Image, attributes: { exclude: ['postId'] } }];

export const PostBaseAttributes = ['id', 'title', 'price', 'updatedAt'];

export const CategoryInclude = {
  model: Category,
  as: 'subcategories',
  attributes: { exclude: ['parentCategoryId'] }
};
