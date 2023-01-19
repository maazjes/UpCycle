import { Request, Response, NextFunction } from 'express';

export interface TypedRequestBody<T> extends Request {
  body: T
}
