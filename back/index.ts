import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { Server } from 'socket.io';
import http from 'http';
import { connectToDatabase } from './util/db.js';
import postsRouter from './controllers/posts.js';
import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import categoriesRouter from './controllers/categories.js';
import imagesRouter from './controllers/images.js';
import favoritesRouter from './controllers/favorites.js';
import { errorHandler } from './util/middleware.js';
import {
  ClientToServerEvents, ServerToClientEvents, SocketData, InterServerEvents
} from './types.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = new Server<
ClientToServerEvents,
ServerToClientEvents,
InterServerEvents,
SocketData
>(server, { path: '/api/chat', cors: {} });

io.use((socket, next): void => {
  const { userId } = socket.handshake.auth;
  if (!userId) {
    return next(new Error('invalid username'));
  }
  socket.data.userId = userId;
  return next();
});

io.on('connection', (socket): void => {
  console.log('a user connected');

  socket.on('message', ({ content, receiverId }): void => {
    console.log(content);
    socket.to;
  });
});

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/images', imagesRouter);
app.use('/api/favorites', favoritesRouter);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectToDatabase();
  server.listen(8080, (): void => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
