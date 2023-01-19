import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './util/db';
import postsRouter from './controllers/posts';
import usersRouter from './controllers/users';
import loginRouter from './controllers/login';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const start = async (): Promise<void> => {
  await connectToDatabase();
  app.listen(8080, (): void => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
export {};
