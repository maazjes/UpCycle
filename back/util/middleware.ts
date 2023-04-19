import { NextFunction, Request, Response } from 'express';
import { ErrorBody } from '@shared/types.js';
import firebase from './firebase.js';

const userExtractor = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authorization = req.get('authorization');
  if (!(authorization && authorization.toLowerCase().startsWith('bearer '))) {
    return next();
  }
  const token = authorization?.substring(7);
  const decodedToken = await firebase.auth().verifyIdToken(token);
  if (!decodedToken) {
    throw new Error('invalid token');
  }
  req.userId = decodedToken.uid;
  return next();
};

const errorHandler = async (
  error: Error,
  _req: Request,
  res: Response<ErrorBody>,
  next: NextFunction
): Promise<void> => {
  const msg = error.message;
  console.log('msg', error);
  res.status(500).json({ error: msg });
  next();
};

export { userExtractor, errorHandler };
