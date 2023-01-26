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

// eslint-disable-next-line import/prefer-default-export
export { tokenExtractor };
