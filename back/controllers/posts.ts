import express from 'express';
import multer from 'multer';
import {
  NewPostBody, PostPages, PostBase, Post as SharedPost,
  UpdatePostBody
} from '@shared/types.js';
import {
  Post, User, Category, Image, Favorite
} from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import {
  saveImages, uploadImages, getPagingData, getPagination
} from '../util/helpers.js';
import { GetPostsQuery } from '../types.js';

const upload = multer();
const router = express.Router();

router.get<{}, PostPages, {}, GetPostsQuery>('', userExtractor, async (req, res): Promise<void> => {
  const {
    userId, page, size, favorite
  } = req.query;
  const attributes = ['id', 'title', 'price'];
  const where = userId ? { userId } : {};
  const postsInclude = [
    {
      model: Image,
      attributes: { exclude: ['postId'] }
    }];
  const { limit, offset } = getPagination(Number(page), Number(size));
  if (favorite && req.user) {
    const favorites = await Favorite.findAndCountAll({
      where: { userId: req.user.id },
      include: {
        model: Post,
        attributes,
        include: postsInclude
      },
      attributes: [],
      limit,
      offset
    });

    const favoritePosts = favorites.rows.map((f): PostBase => f.dataValues.post! as PostBase);
    res.json({ ...getPagingData(favorites.count, Number(page), limit), posts: favoritePosts });
    return;
  }
  const posts = await Post.findAndCountAll({
    attributes,
    include: postsInclude,
    limit,
    offset,
    where
  });
  res.json({ ...getPagingData(posts.count, Number(page), limit), posts: posts.rows as PostBase[] });
});

router.get<{ id: string }, SharedPost>('/:id', userExtractor, async (req, res): Promise<void> => {
  const { id } = req.params;
  const post = await Post.findOne({
    attributes: { exclude: ['userId', 'categoryId'] },
    include: [
      {
        model: Category,
        attributes: ['id', 'name']
      }, {
        model: User,
        attributes: ['id', 'username']
      },
      {
        model: Image,
        attributes: ['uri', 'height', 'width', 'id']
      }],
    where: {
      id
    }
  });
  if (!post) {
    throw new Error('post not found');
  }
  if (req.user) {
    const found = await Favorite.findOne({ where: { postId: Number(id), userId: req.user.id } });
    if (found) {
      post.setDataValue('favoriteId', found.id);
    } else {
      post.setDataValue('favoriteId', null);
    }
  }
  res.json(post as SharedPost);
});

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
    const category = await Category.findOne({ where: { name: req.body.category } });
    if (!category) {
      throw new Error('category not found');
    }
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('images missing from request');
    }
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,
      categoryId: category.id
    });
    const imageUrls = await uploadImages(req.files);
    await saveImages(post.id, imageUrls);
    res.json(post as SharedPost);
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
    const {
      title,
      description,
      price,
      condition,
      postcode
    } = req.body;
    const currentPost = await Post.findOne({ where: { id: req.params.id } });
    if (!currentPost) {
      throw new Error('invalid post id');
    }
    if (req.body.category) {
      const category = await Category.findOne({ where: { name: req.body.category } });
      if (!category) {
        throw new Error('category not found');
      }
      currentPost.categoryId = category.id;
    }
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadImages(req.files);
      await saveImages(currentPost.id, imageUrls);
    }
    const post = await currentPost.update({
      title, description, price, condition, postcode
    });
    res.json(post as SharedPost);
  }
);

export default router;
