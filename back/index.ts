import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { connectToDatabase } from './util/db.js';
import postsRouter from './controllers/posts.js';
import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import categoriesRouter from './controllers/categories.js';
import imagesRouter from './controllers/images.js';
import favoritesRouter from './controllers/favorites.js';
import { errorHandler } from './util/middleware.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/images', imagesRouter);
app.use('/api/favorites', favoritesRouter);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectToDatabase();
  app.listen(8080, (): void => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
