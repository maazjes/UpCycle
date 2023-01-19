const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

// @ts-ignore
// eslint-disable-next-line consistent-return
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return res.status(401).json({ error: 'token missing' });
  }
  const token = authorization.substring(7);
  const decodedToken = jwt.verify(token, SECRET);
  req.decodedToken = decodedToken;
  next();
};

// eslint-disable-next-line import/prefer-default-export
export { tokenExtractor };
