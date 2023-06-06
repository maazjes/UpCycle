import express from 'express';
import multer from 'multer';
import { PostPage, PostBase, Post as SharedPost, TypedImage } from '@shared/types.js';
import { Op, WhereOptions } from 'sequelize';
import { NewPostBody, GetPostsQuery, UpdatePostBody } from '../types.js';
import { Post, Category, Image, Favorite, PostCategory } from '../models/index.js';
import { saveImages, uploadPostImages } from '../util/helpers.js';
import {
  PostInclude,
  PostBaseInclude,
  PostBaseAttributes,
  PostAttributes
} from '../util/constants.js';

const upload = multer();
const router = express.Router();

router.get<{}, PostPage, {}, GetPostsQuery>('/', async (req, res): Promise<void> => {
  const { userId, limit, offset, favorite, contains, categoryId, condition, city } = req.query;
  const userWhere = userId ? { userId } : undefined;
  const containsWhere = contains
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${contains}%` } },
          { description: { [Op.iLike]: `%${contains}%` } }
        ]
      }
    : {};

  let where: WhereOptions = userWhere || containsWhere;
  where = condition ? { ...where, condition } : where;
  where = city ? { ...where, city } : where;

  if (categoryId) {
    const postCategories = await PostCategory.findAndCountAll({
      where: { categoryId: Number(categoryId) },
      include: {
        model: Post,
        attributes: PostBaseAttributes,
        include: PostBaseInclude,
        where,
        order: [['updatedAt', 'DESC']]
      },
      offset: Number(offset),
      limit: Number(limit)
    });

    const categoryPosts = postCategories.rows.map((c): PostBase => c.dataValues.post! as PostBase);
    res.json({
      totalItems: postCategories.count,
      offset: Number(offset),
      data: categoryPosts
    });
    return;
  }

  if (favorite) {
    const favorites = await Favorite.findAndCountAll({
      where: { userId: req.userId! },
      include: {
        model: Post,
        attributes: PostBaseAttributes,
        include: PostBaseInclude,
        where
      },
      attributes: [],
      limit: Number(limit),
      offset: Number(offset),
      order: [['id', 'DESC']]
    });
    const favoritePosts = favorites.rows.map((f): PostBase => f.dataValues.post! as PostBase);
    res.json({
      totalItems: favorites.count,
      offset: Number(offset),
      data: favoritePosts
    });
  }

  const posts = await Post.findAndCountAll({
    attributes: PostBaseAttributes,
    include: PostInclude,
    limit: Number(limit),
    offset: Number(offset),
    where,
    order: [['updatedAt', 'DESC']],
    distinct: true
  });

  res.json({
    totalItems: posts.count,
    offset: Number(offset),
    data: posts.rows
  } as PostPage);
});

router.get<{ id: string }, SharedPost>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const post = await Post.findOne({
    attributes: PostAttributes,
    include: PostInclude,
    where: { id }
  });
  if (!post) {
    throw new Error('Server error. Please try again.');
  }
  const found = await Favorite.findOne({
    where: { postId: Number(id), userId: req.userId! }
  });
  let favoriteId: null | number = null;
  if (found) {
    favoriteId = found.id;
  }
  res.json({ ...post.dataValues, favoriteId } as SharedPost);
});

router.delete<{ id: string }>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error('Server error. Please try again.');
  }
  await Image.destroy({ where: { postId: id } });
  await Favorite.destroy({ where: { postId: id } });
  await PostCategory.destroy({ where: { postId: id } });
  await Post.destroy({ where: { id } });
  res.status(204).send();
});

router.post<{}, SharedPost, NewPostBody>(
  '/',
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    const categories: number[] = JSON.parse(req.body.categories);
    const foundCategories = await Category.findAll({
      where: { id: { [Op.or]: categories } }
    });
    if (categories.length !== foundCategories.length) {
      throw new Error('Invalid categories. Try selecting them again.');
    }
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('Images are required.');
    }
    const post = await Post.create({
      ...req.body,
      categories: undefined,
      userId: req.userId!
    });
    const postCategories = categories.map((categoryId): { categoryId: number; postId: number } => ({
      categoryId,
      postId: post.id
    }));
    await PostCategory.bulkCreate(postCategories);
    const imageUris = await uploadPostImages(req.files);
    const images = await saveImages(imageUris, post.id);
    const finalImages = images.map((image): TypedImage => image.dataValues);
    res.json({ ...post.dataValues, favoriteId: null, images: finalImages } as SharedPost);
  }
);

router.put<{ id: string }, SharedPost, UpdatePostBody>(
  '/:id',
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    const categories: number[] | undefined = req.body.categories && JSON.parse(req.body.categories);

    const currentPost = await Post.findOne({ where: { id: req.params.id } });
    if (!currentPost) {
      throw new Error('Server error. Please try again.');
    }
    if (categories) {
      const foundCategories = await Category.findAll({
        where: { id: { [Op.or]: categories } }
      });
      if (categories.length !== foundCategories.length) {
        throw new Error('Invalid categories. Try selecting them again.');
      }
      await PostCategory.destroy({ where: { postId: currentPost.id } });
      const postCategories = categories.map(
        (categoryId): { categoryId: number; postId: number } => ({
          categoryId,
          postId: currentPost.id
        })
      );
      await PostCategory.bulkCreate(postCategories);
    }
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadPostImages(req.files);
      await saveImages(imageUrls, currentPost.id);
    }
    const valuesToAdd = { ...req.body, categories: undefined };
    delete valuesToAdd.categories;
    currentPost.set(valuesToAdd);

    const post = await currentPost.save();
    res.json({ ...post.dataValues, favoriteId: null } as SharedPost);
  }
);

export default router;
