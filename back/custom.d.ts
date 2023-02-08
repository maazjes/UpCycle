import { DecodedToken } from './types';

declare global {
  namespace Express {
    interface Request {
      decodedToken?: DecodedToken;
    }
  }
}
