const router = require('express').Router();
const { User, Post } = require('../models');

// @ts-ignore
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Post,
      attributes: { exclude: ['userId'] }
    }
  });
  res.json(users);
});

// @ts-ignore
router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

export default router;
