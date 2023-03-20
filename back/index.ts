/* eslint-disable @typescript-eslint/no-shadow */
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { Server } from 'socket.io';
import http from 'http';
import { isString } from './util/helpers.js';
import { connectToDatabase } from './util/db.js';
import postsRouter from './controllers/posts.js';
import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import categoriesRouter from './controllers/categories.js';
import imagesRouter from './controllers/images.js';
import favoritesRouter from './controllers/favorites.js';
import chatsRouter from './controllers/chats.js';
import messagesRouter from './controllers/messages.js';
import tokensRouter from './controllers/tokens.js';
import followsRouter from './controllers/follows.js';
import passwordResetRouter from './controllers/passwordReset.js';
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
  socket.data.userId = String(userId);
  return next();
});

io.on('connection', async (socket): Promise<void> => {
  console.log('connected');
  const { userId } = socket.handshake.auth;
  if (!userId || !isString(userId)) {
    throw new Error('invalid username');
  }
  socket.join(userId);

  socket.on('message', ({
    text, userId, createdAt, images
  }): void => {
    socket.broadcast.to(userId).emit('message', { text, createdAt, images });
  });

  socket.on('join', (userId): void => {
    socket.join(userId);
  });

  socket.on('leave', (userId): void => {
    socket.leave(userId);
  });
});

app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/images', imagesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/chats', chatsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/passwordreset', passwordResetRouter);
app.use('/api', followsRouter);
app.use('/api', tokensRouter);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectToDatabase();
  server.listen(8080, (): void => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
