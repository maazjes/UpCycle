import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL ?? 'test';
const PORT = process.env.PORT ?? 3001;
const SECRET = process.env.SECRET ?? 'susanna';
const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID ?? 'asd';
const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY ?? 'asd';
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY ?? ' asd';

export {
  DATABASE_URL,
  PORT,
  SECRET,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  FIREBASE_API_KEY
};
