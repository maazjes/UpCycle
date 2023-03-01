import { Request as ExpressRequest } from 'express';
import { IncomingHttpHeaders } from 'http';
import { SharedGetMessagesQuery, SharedGetPostsQuery, SharedGetUsersQuery } from '@shared/types';
import { User } from './models';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export interface RequestWithHeader<
P, ResBody, ReqBody, ReqQuery, ReqHeaders
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery> {
  headers: IncomingHttpHeaders & ReqHeaders;
}

export interface DecodedToken {
  username: string;
  id: number;
}

export type PaginationQuery = {
  page: string;
  size: string;
};

export type GetUsersQuery = PaginationQuery & SharedGetUsersQuery;

export type GetMessagesQuery = PaginationQuery & SharedGetMessagesQuery;

export type GetPostsQuery = PaginationQuery & SharedGetPostsQuery & { postId?: string };

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
