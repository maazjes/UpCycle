import { Request as ExpressRequest } from 'express';
import { IncomingHttpHeaders } from 'http';
import {
  SharedGetMessagesQuery,
  SharedGetPostsQuery,
  UserBase,
  SharedNewPostBody,
  TypedImage,
  SharedNewUserBody
} from '@shared/types';

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

export interface NewPostBody extends SharedNewPostBody {
  categories: string;
}

export interface UpdatePostBody extends Partial<NewPostBody> {}

export interface UpdateUserBody extends Omit<Partial<SharedNewUserBody>, 'email' | 'password'> {}

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

export interface FirebasePasswordResetRes {
  email: string;
  requestType: string;
}

export type GetMessagesQuery = PaginationQuery & SharedGetMessagesQuery;

export type GetPostsQuery = PaginationQuery & SharedGetPostsQuery;

export type GetFollowsQuery = PaginationQuery;

export interface UserBaseKeys extends Array<keyof UserBase> {}

export interface RequestWithHeader<P, ResBody, ReqBody, ReqQuery, ReqHeaders>
  extends ExpressRequest<P, ResBody, ReqBody, ReqQuery> {
  headers: IncomingHttpHeaders & ReqHeaders;
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  message: ({
    text,
    createdAt,
    images
  }: {
    text: string;
    createdAt: Date;
    images?: TypedImage[];
  }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  message: ({
    text,
    userId,
    createdAt,
    images
  }: {
    text: string;
    userId: string;
    createdAt: Date;
    images: TypedImage[];
  }) => void;
  join: (userId: string) => void;
  leave: (userId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}
