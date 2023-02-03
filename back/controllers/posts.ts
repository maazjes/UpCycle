import express, { Response, Request } from 'express';
import probe, { ProbeResult } from 'probe-image-size';
import {
  PaginationBase,
  DecodedToken, NewPostBody
} from '../types';
import upload from '../util/multer';
import {
  Post, User, Category, Image
} from '../models';
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

const createMasonryLists = (posts: Post[], amount: number): Post[][] => {
  const postLists = Array(amount).fill(-1).map((): [number, Post[]] => [0, []]);
  posts.forEach((post): void => {
    const sorted = postLists.sort((a, b): number => a[0] - b[0]);
    if (post.images) {
      sorted[0] = [sorted[0][0] + post.images[0].height, sorted[0][1].concat(post)];
    }
  });
  const finalPostLists = postLists.map((postList): Post[] => postList[1]);
  return finalPostLists;
};

interface PostsResponse extends PaginationBase {
  posts: Post[] | Post[][];
}

interface GetPostsQuery {
  page: string;
  size: string;
  userId?: string;
  masonry?: string;
  postId?: string;
}

router.get<{}, PostsResponse, {}, GetPostsQuery>('/', async (req, res): Promise<void> => {
  let where = {};
  const {
    userId, postId, masonry, page, size
  } = req.query;
  where = userId ? { ...where, userId } : where;
  where = postId ? { ...where, postId } : where;
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
    },
    {
      model: Image,
      attributes: ['url', 'height', 'width']
    }],
    limit,
    offset,
    where
  });
  const response = getPagingData({ count: posts.count, rows: posts.rows }, Number(page), limit);
  if (masonry) {
    // @ts-ignore
    response.posts = createMasonryLists(response.posts, Number(masonry));
  }
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
    },
    {
      model: Image,
      attributes: ['url', 'height', 'width']
    }],
    where
  });
  if (!post) {
    throw new Error('post not found');
  }
  res.json(post);
});

router.delete<{ id: string }, { error: number } | Post>('/:id', async (req, res): Promise<void> => {
  const { id } = req.params;
  const where = id ? { id } : {};
  const post = await Post.findOne({ where });
  if (!post) {
    throw new Error('post not found');
  }
  await post.destroy();
  res.json(post);
});

type MulterFiles = { [fieldname: string]: MulterFile[];
} | MulterFile[] | undefined;

interface MulterFile extends Express.Multer.File {
  location?: string;
}

interface AuthRequest extends Request<{}, {}, NewPostBody> {
  decodedToken?: DecodedToken;
  files?: MulterFiles;
}

router.post(
  '/',
  tokenExtractor,
  upload.array('images', 5),
  async (req: AuthRequest, res: Response<Post>): Promise<void> => {
    console.log(req.body);
    if (!req.decodedToken?.id) {
      throw new Error('invalid token');
    }
    const user = await User.findByPk(req.decodedToken?.id);
    if (!user) {
      throw new Error('user not found');
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
      userId: user.id,
      categoryId: category.id
    });
    const dimensionPromises = req.files.filter(
      (file): file is typeof file & { location: string } => file.location !== undefined
    ).map((file): Promise<ProbeResult> => probe(file.location));
    const dimensions = await Promise.all(dimensionPromises);
    if (!dimensions) {
      throw new Error('getting image dimensions failed');
    }
    const imagePromises = dimensions.map((image): Promise<Image> => Image.create({
      url: image.url,
      width: image.width,
      height: image.height,
      postId: post.id
    }));
    const images = await Promise.all(imagePromises);
    if (!images) {
      throw new Error('saving images failed');
    }
    res.json(post);
  }
);

export default router;
