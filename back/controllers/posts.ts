import express from 'express';
import multer from 'multer';
import { PostPage, PostBase, Post as SharedPost } from '@shared/types.js';
import { Op } from 'sequelize';
import { NewPostBody, GetPostsQuery, UpdatePostBody } from '../types.js';
import { Post, Category, Image, Favorite, PostCategory } from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { saveImages, uploadImages } from '../util/helpers.js';
import {
  PostInclude,
  PostBaseInclude,
  PostBaseAttributes,
  PostAttributes
} from '../util/constants.js';

const upload = multer();
const router = express.Router();

router.get<{}, PostPage, {}, GetPostsQuery>(
  '/',
  userExtractor,
  async (req, res): Promise<void> => {
    const { userId, limit, offset, favorite, contains, categoryId } = req.query;
    const userWhere = userId ? { userId } : undefined;
    const containsWhere = contains
      ? {
          [Op.or]: [
            { title: { [Op.substring]: contains } },
            { description: { [Op.substring]: contains } }
          ]
        }
      : {};

    const where = userWhere || containsWhere;

    if (categoryId && req.user) {
      const postCategories = await PostCategory.findAndCountAll({
        where: { categoryId: Number(categoryId) },
        include: {
          model: Post,
          attributes: PostBaseAttributes,
          include: PostBaseInclude,
          where
        }
      });
      const categoryPosts = postCategories.rows.map(
        (c): PostBase => c.dataValues.post! as PostBase
      );
      res.json({
        totalItems: postCategories.count,
        offset: Number(offset),
        data: categoryPosts
      });
      return;
    }

    if (favorite && req.user) {
      const favorites = await Favorite.findAndCountAll({
        where: { userId: req.user.id },
        include: {
          model: Post,
          attributes: PostBaseAttributes,
          include: PostBaseInclude
        },
        attributes: [],
        limit: Number(limit),
        offset: Number(offset)
      });
      const favoritePosts = favorites.rows.map(
        (f): PostBase => f.dataValues.post! as PostBase
      );
      res.json({
        totalItems: favorites.count,
        offset: Number(offset),
        data: favoritePosts
      });
      return;
    }

    const posts = await Post.findAndCountAll({
      attributes: PostBaseAttributes,
      include: PostInclude,
      limit: Number(limit),
      offset: Number(offset),
      where,
      distinct: true
    });

    res.json({
      totalItems: posts.count,
      offset: Number(offset),
      data: posts.rows
    } as PostPage);
  }
);

router.get<{ id: string }, SharedPost>(
  '/:id',
  userExtractor,
  async (req, res): Promise<void> => {
    console.log(req.params);
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const { id } = req.params;
    const post = await Post.findOne({
      attributes: PostAttributes,
      include: PostInclude,
      where: { id }
    });
    if (!post) {
      throw new Error('post not found');
    }
    const found = await Favorite.findOne({
      where: { postId: Number(id), userId: req.user.id }
    });
    let favoriteId = null;
    if (found) {
      favoriteId = found.id;
    }
    res.json({ ...post.dataValues, favoriteId } as SharedPost);
  }
);

router.delete<{ id: string }>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error('id missing from params');
  }
  await Image.destroy({ where: { postId: id } });
  await Favorite.destroy({ where: { postId: id } });
  await Post.destroy({ where: { id } });
  res.status(204).send();
});

router.post<{}, SharedPost, NewPostBody>(
  '/',
  userExtractor,
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const categories: number[] = JSON.parse(req.body.categories);
    const foundCategories = await Category.findAll({
      where: { id: { [Op.or]: categories } }
    });
    if (categories.length !== foundCategories.length) {
      throw new Error('one or more invalid category');
    }
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('images missing from request');
    }
    const post = await Post.create({
      ...req.body,
      categories: undefined,
      userId: req.user.id
    });
    const postCategories = categories.map(
      (categoryId): { categoryId: number; postId: number } => ({
        categoryId,
        postId: post.id
      })
    );
    await PostCategory.bulkCreate(postCategories);
    const imageUrls = await uploadImages(req.files);
    await saveImages(imageUrls, post.id);
    res.json({ ...post, favoriteId: null } as SharedPost);
  }
);

router.put<{ id: string }, SharedPost, UpdatePostBody>(
  '/:id',
  userExtractor,
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const { title, description, price, condition, postcode } = req.body;
    const categories: number[] | null = req.body.categories
      ? JSON.parse(req.body.categories)
      : null;

    const currentPost = await Post.findOne({ where: { id: req.params.id } });
    if (!currentPost) {
      throw new Error('invalid post id');
    }
    if (categories) {
      const foundCategories = await Category.findAll({
        where: { id: { [Op.or]: categories } }
      });
      if (categories.length !== foundCategories.length) {
        throw new Error('one or more invalid category');
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
      const imageUrls = await uploadImages(req.files);
      await saveImages(imageUrls, currentPost.id);
    }
    currentPost.set({
      title,
      description,
      price,
      condition,
      postcode
    });
    const post = await currentPost.save();
    res.json({ ...post, favoriteId: null } as SharedPost);
  }
);

export default router;
