import { Request as ExpressRequest } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface RequestWithHeader<
P, ResBody, ReqBody, ReqQuery, ReqHeaders
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery> {
  headers: IncomingHttpHeaders & ReqHeaders;
}
export interface PaginationBase {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface DecodedToken {
  username: string;
  id: number;
}

export interface TypedImage {
  uri: string;
  width: number;
  height: number;
  id: number;
}

export type Condition = 'new' | 'slightly used' | 'used';

export interface NewPostBody {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: Condition;
  postcode: string;
}

export interface UserBase {
  id: string;
  bio?: string;
  photoUrl?: string;
  email: string;
  displayName: string;
}

export interface FirebaseLoginRes {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  message: () => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  message: ({ content, receiverId }: { content: string; receiverId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}
