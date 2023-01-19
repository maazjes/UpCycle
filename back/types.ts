import Express from 'express';
import { Query, Send } from 'express-serve-static-core';
import { IncomingHttpHeaders } from 'http';

export interface Request<ReqQuery extends Query, ReqHeaders, ReqBody> extends Express.Request {
  query: ReqQuery;
  body: ReqBody;
  headers: IncomingHttpHeaders & ReqHeaders;
}

export interface Response<ResBody> extends Express.Response {
  json: Send<ResBody, this>;
}

export interface PaginationBase {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
