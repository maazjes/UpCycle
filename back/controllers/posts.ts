import express from 'express';
import multer from 'multer';
import {
  PaginationBase,
  NewPostBody
} from '../types.js';
import {
  Post, User, Category, Image, Favorite
} from '../models/index.js';
import { userExtractor } from '../util/middleware.js';
import {
  saveImages, uploadImages, getPagingData, getPagination
} from '../util/helpers.js';

const upload = multer();
const router = express.Router();

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

router.delete<{ id: string }, number>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new Error('id missing from params');
  }
  await Image.destroy({ where: { postId: id } });
  await Favorite.destroy({ where: { postId: id } });
  const deletedPost = await Post.destroy({ where: { id } });
  res.json(deletedPost);
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
    const imageUrls = await uploadImages(req.files);
    await saveImages(post.id, imageUrls);
    res.json(post);
  }
);

router.put<{ id: string }, Post, Partial<NewPostBody>>(
  '/:id',
  userExtractor,
  upload.array('images', 5),
  async (req, res): Promise<void> => {
    if (!req.user) {
      throw new Error('invalid token');
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
    res.json(post);
  }
);

export default router;
