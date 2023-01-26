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

export interface ErrorResponse {
  error: string;
}

export interface DecodedToken {
  username: string;
  id: number;
}

export interface NewPostBody {
  title: string;
  description: string;
  price: string;
  category: string;
}
