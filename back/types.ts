import { Request as ExpressRequest } from 'express';
import { IncomingHttpHeaders } from 'http';
import {
  SharedGetMessagesQuery, SharedGetPostsQuery,
  UserBase
} from '@shared/types';
import { User } from './models';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export interface DecodedToken {
  username: string;
  id: number;
}

export type PaginationQuery = {
  limit: string;
  offset: string;
};

export interface FirebaseLoginRes {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

export interface FirebaseTokenRes {
  expires_in: string;
  token_type: 'Bearer';
  refresh_token: string;
  id_token: string;
  user_id: string;
  project_id: string;
}

export type GetMessagesQuery = PaginationQuery & SharedGetMessagesQuery;

export type GetPostsQuery = PaginationQuery & SharedGetPostsQuery;

export type GetFollowsQuery = PaginationQuery;

export interface UserBaseKeys extends Array<keyof UserBase> {}

export interface RequestWithHeader<
P, ResBody, ReqBody, ReqQuery, ReqHeaders
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery> {
  headers: IncomingHttpHeaders & ReqHeaders;
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  message: ({ content, createdAt }: { content: string; createdAt: Date }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  message: ({ content, chatId, createdAt }:
  { content: string; chatId: number; createdAt: Date }) => void;
  join: (chatId: number) => void;
  leave: (chatId: number) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}
