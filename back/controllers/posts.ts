import express from 'express';
import multer from 'multer';
import {
  SharedNewPostBody, PostPage, PostBase, Post as SharedPost,
  SharedUpdatePostBody
} from '@shared/types.js';
import {
  Post, Category, Image, Favorite
} from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { saveImages, uploadImages } from '../util/helpers.js';
import { GetPostsQuery } from '../types.js';
import {
  PostInclude, PostBaseInclude, PostBaseAttributes, PostAttributes
} from '../util/constants.js';

const upload = multer();
const router = express.Router();

router.get<{}, PostPage, {}, GetPostsQuery>('', userExtractor, async (req, res): Promise<void> => {
  const {
    userId, limit, offset, favorite
  } = req.query;
  const where = userId ? { userId } : {};
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

    const favoritePosts = favorites.rows.map((f): PostBase => f.dataValues.post! as PostBase);
    res.json({ totalItems: favorites.count, offset: Number(offset), data: favoritePosts });
    return;
  }
  const posts = await Post.findAndCountAll({
    attributes: PostBaseAttributes,
    include: PostBaseInclude,
    limit: Number(limit),
    offset: Number(offset),
    where
  });
  res.json({ totalItems: posts.count, offset: Number(offset), data: posts.rows } as PostPage);
});

router.get<{ id: string }, SharedPost>('/:id', userExtractor, async (req, res): Promise<void> => {
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
  const found = await Favorite.findOne({ where: { postId: Number(id), userId: req.user.id } });
  let favoriteId = null;
  if (found) {
    favoriteId = found.id;
  }
  res.json({ ...post, favoriteId } as SharedPost);
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

router.post<{}, SharedPost, SharedNewPostBody>(
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
    console.log(req.body);
    const post = await Post.create({
      ...req.body,
      userId: req.user.id,
      categoryId: category.id
    });
    const imageUrls = await uploadImages(req.files);
    await saveImages(post.id, imageUrls);
    res.json({ ...post, favoriteId: null } as SharedPost);
  }
);

router.put<{ id: string }, SharedPost, SharedUpdatePostBody>(
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
      currentPost.set({ categoryId: category.id });
    }
    if (req.files && Array.isArray(req.files)) {
      const imageUrls = await uploadImages(req.files);
      await saveImages(currentPost.id, imageUrls);
    }
    currentPost.set({
      title, description, price, condition, postcode
    });
    const post = await currentPost.save();
    res.json({ ...post, favoriteId: null } as SharedPost);
  }
);

export default router;
