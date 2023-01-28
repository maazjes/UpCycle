import express, { Response, Request } from 'express';
import {
  PaginationBase,
  DecodedToken, NewPostBody
} from '../types';
import upload from '../util/multer';
import { Post, User, Category } from '../models';
import { tokenExtractor } from '../util/middleware';

const router = express.Router();

const getPagination = (page: number, size: number): { limit: number; offset: number } => {
  const limit = size ? +size : 3;
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

router.get<{}, PostsResponse, {}, { userId: number; page: number; size: number }>('/', async (req, res): Promise<void> => {
  const { userId } = req.query;
  const where = userId ? { userId } : {};
  const { page, size } = req.query;
  const { limit, offset } = getPagination(Number(page), Number(size));
  const posts = await Post.findAndCountAll({
    attributes: { exclude: ['userId'] },
    include: [{
      model: User,
      attributes: ['id', 'username']
    },
    {
      model: Category,
      attributes: ['id', 'name']
    }],
    limit,
    offset,
    where
  });
  const response = getPagingData({ count: posts.count, rows: posts.rows }, Number(page), limit);
  res.json(response);
});

router.get<{ id: string }, Post>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const where = id ? { id } : {};
  const post = await Post.findOne({
    attributes: { exclude: ['userId', 'categoryId'] },
    include: [{
      model: User,
      attributes: ['id', 'username']
    },
    {
      model: Category,
      attributes: ['id', 'name']
    }],
    where
  });
  if (!post) {
    throw new Error('post not found');
  }
  res.json(post);
});

router.delete<{ id: string }, { error: string } | Post>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const where = id ? { id } : {};
  const post = await Post.findOne({ where });
  if (!post) {
    throw new Error('post not found');
  }
  await post.destroy();
  res.json(post);
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
interface MulterFile extends Express.Multer.File {
  location?: string;
}

interface AuthRequest extends Request<{}, {}, NewPostBody> {
  decodedToken?: DecodedToken;
  file?: MulterFile;
}

router.post('/', tokenExtractor, upload.single('img'), async (req: AuthRequest, res: Response<Post | { error: string }>): Promise<void> => {
  console.log(req.body);
  if (!req.decodedToken?.id) {
    throw new Error('invalid token');
  }
  const user = await User.findByPk(req.decodedToken?.id);
  const category = await Category.findOne({ where: { name: req.body.category } });
  if (!user) {
    throw new Error('user not found');
  }
  if (!category) {
    throw new Error('category not found');
  }
  console.log(req.file);
  if (!req.file?.location) {
    throw new Error('image missing from request');
  }
  const post = await Post.create({
    ...req.body,
    userId: user.id,
    categoryId: category.id,
    imageUrl: req.file.location
  });
  res.json(post);
});

export default router;
