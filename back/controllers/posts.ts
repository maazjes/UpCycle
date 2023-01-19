import express from 'express';
import { Request, Response, PaginationBase } from '../types';
import upload from '../util/multer';
import { Post, User } from '../models';
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

router.get('/', async (req: Request<{ page: string; size: string }, {}, {}>, res: Response<PostsResponse>): Promise<void> => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(Number(page), Number(size));
  const posts = await Post.findAndCountAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    limit,
    offset
  });
  const response = getPagingData({ count: posts.count, rows: posts.rows }, Number(page), limit);
  res.json(response);
});

interface MulterFile extends File {
  location: string;
}

interface AuthRequest extends Request<{}, {}, { title: string; price: string; img: MulterFile }> {
  decodedToken?: { id: string };
}
router.post('/', upload.single('img'), tokenExtractor, async (req: AuthRequest, res: Response<{}>): Promise<void> => {
  const user = await User.findByPk(req.decodedToken?.id);
  if (user) {
    const post = await Post.create({
      ...req.body,
      userId: user.id,
      // @ts-ignore
      imageUrl: req.file?.location
    });
    res.json(post);
  }
  res.status(401).json({ error: 'invalid token' });
});

export default router;
