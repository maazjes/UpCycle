import { User } from '../../models/index.js';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
