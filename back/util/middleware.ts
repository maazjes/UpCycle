import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';
import { DecodedToken } from '../types';

interface TokenExtractorRequest extends Request {
  decodedToken?: DecodedToken;
}

const tokenExtractor = async (
  req: TokenExtractorRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    res.status(401).json({ error: 'token missing' });
    return;
  }
  const token = authorization?.substring(7);
  if (token) {
    const decodedToken = jwt.verify(token, SECRET);
    req.decodedToken = decodedToken as DecodedToken;
  }
  next();
};

const errorHandler = async (
  error: Error,
  // @ts-ignore
  req: Request,
  // @ts-ignore
  res: Response,
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
    res.status(404).json({ error: 'Invalid category. Please choose another one.' });
  } else if (msg === 'image missing from request') {
    res.status(500).json({ error: 'Image upload failed. Please try again.' });
  } else if (msg === 'invalid token') {
    res.status(401).json({ error: 'Authentication failed.' });
  }
  next();
};

// eslint-disable-next-line import/prefer-default-export
export { tokenExtractor, errorHandler };
