const router = require('express').Router();
const { Post, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');

// @ts-ignore
router.get('/', async (_req, res) => {
  const posts = await Post.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  });
  return res.json(posts);
});

// @ts-ignore
router.post('/', tokenExtractor, async (req, res) => {
  console.log('body', req);
  const user = await User.findByPk(req.decodedToken.id);
  if (user) {
    const post = await Post.create({
      ...req.body,
      userId: user.id
    });
    return res.json(post);
  }
  return res.status(401).json({ error: 'invalid token' });
});

module.exports = router;
export {};
