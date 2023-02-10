import express from 'express';
import {
  PaginationBase,
  NewPostBody
} from '../types.js';
import upload from '../util/multer.js';
import {
  Post, User, Category, Image, Favorite
} from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import { saveImages } from '../util/helpers.js';

const router = express.Router();

const getPagination = (page: number, size: number): { limit: number; offset: number } => {
  const limit = size || 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data: { count: number; rows: Post[] }, page: number, limit: number): {
  totalItems: number;
  posts: Post[];
  totalPages: number;
  currentPage: number;
} => {
  const { count: totalItems, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems, posts, totalPages, currentPage
  };
};

interface PostsResponse extends PaginationBase {
  posts: Post[];
}

type GetPostsQuery = {
  page: string;
  size: string;
  userId?: string;
  postId?: string;
};

router.get<{}, PostsResponse, GetPostsQuery>('/', userExtractor, async (req, res): Promise<void> => {
  let where = {};
  const {
    userId, postId, page, size
  } = req.query;
  where = userId ? { ...where, userId } : where;
  where = postId ? { ...where, id: postId } : where;
  const { limit, offset } = getPagination(Number(page), Number(size));
  const posts = await Post.findAndCountAll({
    attributes: { exclude: ['userId'] },
    include: [{
      model: User
    },
    {
      model: Category,
      attributes: ['id', 'name']
    },
    {
      model: Image,
      attributes: { exclude: ['postId'] }
    }],
    limit,
    offset,
    where
  });

  const response = getPagingData({ count: posts.count, rows: posts.rows }, Number(page), limit);

  if (req.user && postId) {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      throw new Error('user not found');
    }
    const found = await Favorite.findOne({ where: { postId: Number(postId), userId: user.id } });
    if (found) {
      response.posts[0].setDataValue('favoriteId', found.id);
    }
  }
  res.json(response);
});

router.get<{ id: string }, Post>('/:id', userExtractor, async (req, res): Promise<void> => {
  const { id } = req.params;
  const post = await Post.findOne({
    attributes: { exclude: ['userId', 'categoryId'] },
    include: [{
      model: User
    },
    {
      model: Category,
      attributes: ['id', 'name']
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
  res.json(post);
});

router.delete<{ id: string }, Post>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const where = id ? { id } : {};
  const post = await Post.findOne({
    include: {
      model: Image
    },
    where
  });
  if (!post) {
    throw new Error('post not found');
  }
  if (post.images) {
    const imagePromises = post.images.map((image): Promise<void> => image.destroy());
    await Promise.all(imagePromises);
  }
  await post.destroy();
  res.json(post);
});

router.post<{}, Post, NewPostBody>(
  '/',
  userExtractor,
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('invalid token');
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
    await saveImages(post.id, req.files);
    res.json(post);
  }
);

router.put<{ id: string }, Post, NewPostBody>(
  '/:id',
  userExtractor,
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('invalid token');
    }
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
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('images missing from request');
    }
    await saveImages(currentPost.id, req.files);
    (Object.keys(req.body)
      .filter((key): boolean => key !== 'category') as Array<keyof Omit<NewPostBody, 'category'>>)
      .forEach((key): void => {
        currentPost[key] = req.body[key];
      });
    const updatedPost = await currentPost.save();
    res.json(updatedPost);
  }
);

export default router;
