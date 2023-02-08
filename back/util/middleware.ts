import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';
import { DecodedToken } from '../types';

interface TokenExtractorRequest extends Request {
  decodedToken?: DecodedToken;
}

const tokenExtractor = async (
  req: TokenExtractorRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return next();
  }
  const token = authorization?.substring(7);
  const decodedToken = jwt.verify(token, SECRET);
  if (!decodedToken) {
    throw new Error('invalid token');
  }
  req.decodedToken = decodedToken as DecodedToken;
  return next();
};

const errorHandler = async (
  error: Error,
  _req: Request,
  res: Response<{ error: string }>,
  next: NextFunction
): Promise<void> => {
  const msg = error.message;
  if (msg === 'invalid username') {
    res.status(401).json({ error: 'This username does not exist.' });
  } else if (msg === 'invalid password') {
    res.status(401).json({ error: 'Invalid username or password.' });
  } else if (msg === 'post not found by') {
    res.status(404).json({ error: 'Post not found.' });
  } else if (msg === 'user not found') {
    res.status(404).json({ error: 'User not found.' });
  } else if (msg === 'category not found') {
    res.status(400).json({ error: 'Invalid category. Please choose another one.' });
  } else if (msg === 'images missing from request' || msg === 'saving images failed' || msg === 'getting image dimensions failed') {
    res.status(500).json({ error: 'Image upload failed. Please try again.' });
  } else if (msg === 'invalid token') {
    res.status(401).json({ error: 'Authentication failed.' });
  } else if (msg === 'invalid post id') {
    res.status(401).json({ error: 'post not found' });
  } else {
    res.status(500).json({ error: msg });
  }
  next();
};

export { tokenExtractor, errorHandler };
