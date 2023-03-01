import express from 'express';
import multer from 'multer';
import {
  EmailUser, FollowUser,
  NewUserBody, UserPages, ChatUser, PostsUser
} from '@shared/types';
import { Op } from 'sequelize';
import { GetUsersQuery } from '../types.js';
import { userExtractor } from '../util/middleware.js';
import {
  User, Post, Image, Follow, Chat
} from '../models/index.js';
import firebase from '../util/firebase.js';
import { uploadImage, getPagination, getPagingData } from '../util/helpers.js';

const router = express.Router();
const upload = multer();

router.get<{}, UserPages, {}, GetUsersQuery>('', userExtractor, async (req, res): Promise<void> => {
  const currentUser = req.user;
  if (!currentUser) {
    throw new Error('authentication required');
  }
  const {
    followedId, followerId, page, size, chats
  } = req.query;
  const { limit, offset } = getPagination(Number(page), Number(size));

  const userAttributes = ['id', 'displayName', 'username', 'photoUrl'];
  let users: FollowUser[] | ChatUser[] = [];
  let count = 0;

  if (followedId || followerId) {
    const fOrF = followedId ? 'followed' : 'follower';
    const follows = await Follow.findAndCountAll({
      include: {
        model: User,
        as: fOrF,
        attributes: userAttributes
      },
      limit,
      offset,
      where: followedId
        ? { followedId }
        : { followerId },
      attributes: ['id', 'followerId']
    });
    count = follows.count;
    users = follows.rows.map((f): FollowUser => {
      const follow = f.dataValues;
      const following = follow.followerId === req.user!.id;
      return ({ ...follow[fOrF]!.dataValues, followId: follow.id, following });
    });
  }

  if (chats === 'true') {
    const userChats = await Chat.findAndCountAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: userAttributes
      }, {
        model: User,
        as: 'user',
        attributes: userAttributes
      }],
      where: { [Op.or]: [{ creatorId: currentUser.id }, { userId: currentUser.id }] },
      attributes: ['id']
    });
    count = userChats.count;
    users = userChats.rows.map((c): ChatUser => {
      const chat = c.dataValues;
      const user = chat.creatorId === currentUser.id
        ? chat.user!
        : chat.creator!;
      return ({ ...user, chatId: chat.id });
    });
  }

  res.json({
    ...getPagingData(count, Number(page), limit),
    users
  });
});

router.get<{ id: string }, PostsUser>('/:id', userExtractor, async (req, res): Promise<void> => {
  const { id } = req.params;
  if (!req.user || req.user.id !== id) {
    throw new Error('authentication required');
  }
  const user = await User.findOne({
    include: {
      model: Post,
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: Image,
          attributes: { exclude: ['postId'] }
        }
      ]
    },
    where: { id }
  });
  if (!user) {
    throw new Error('user not found');
  }
  const { email } = await firebase.auth().getUser(id);
  if (!email) {
    throw new Error('user not found');
  }
  res.json({ ...user.dataValues as PostsUser });
});

router.post<{}, User, NewUserBody>('/', upload.single('image'), async (req, res): Promise<void> => {
  const {
    email, displayName, password, bio, username
  } = req.body;
  const { uid } = await firebase.auth().createUser({ email, password });
  const user = User.build({
    id: uid, displayName, bio, username, photoUrl: ''
  });
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    user.set({ photoUrl });
  }
  const saved = await user.save();
  res.json(saved);
});

router.put<{ id: string }, EmailUser, Partial<NewUserBody>>('/:id', userExtractor, upload.single('image'), async (req, res): Promise<void> => {
  const { id } = req.query;
  if (!req.user || req.user.id !== id) {
    throw new Error('authentication required');
  }
  const {
    email, displayName, password, bio, username
  } = req.body;
  const valuesToUpdate = { displayName, bio, username };
  const fbUser = await firebase.auth().updateUser(req.user.id, { email, password });
  if (!fbUser.email) {
    throw new Error('email does not exist');
  }
  if (req.file) {
    const photoUrl = await uploadImage(req.file);
    req.user.set({ photoUrl });
  }
  (Object.keys(valuesToUpdate) as (keyof typeof valuesToUpdate)[])
    .forEach((key): boolean => !valuesToUpdate[key] && delete valuesToUpdate[key]);
  req.user.set(valuesToUpdate);
  const user = await req.user.save();
  res.json({
    email: fbUser.email,
    id: user.id,
    displayName: user.displayName,
    bio: user.bio,
    photoUrl: user.photoUrl,
    username: user.username
  });
});

export default router;
