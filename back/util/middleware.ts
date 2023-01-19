import { NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET } from './config';
import { Request, Response } from '../types';

interface TokenExtractorRequest extends Request<{}, { authorization?: string }, {}> {
  decodedToken?: string | JwtPayload;
}

const tokenExtractor = async (
  req: TokenExtractorRequest,
  res: Response<{ error?: string }>,
  next: NextFunction
): Promise<void> => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    res.status(401).json({ error: 'token missing' });
  }
  const token = authorization?.substring(7);
  if (token) {
    const decodedToken = jwt.verify(token, SECRET);
    req.decodedToken = decodedToken;
  }
  next();
};

// eslint-disable-next-line import/prefer-default-export
export { tokenExtractor };
