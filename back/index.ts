/* eslint-disable @typescript-eslint/no-shadow */
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { Server } from 'socket.io';
import http from 'http';
import { isString } from './util/helpers.js';
import { connectToDatabase } from './util/db.js';
import posts from './controllers/posts.js';
import users from './controllers/users.js';
import login from './controllers/login.js';
import categories from './controllers/categories.js';
import images from './controllers/images.js';
import favorites from './controllers/favorites.js';
import chats from './controllers/chats.js';
import messages from './controllers/messages.js';
import tokens from './controllers/tokens.js';
import follows from './controllers/follows.js';
import passwords from './controllers/passwords.js';
import chatInfo from './controllers/chatInfo.js';
import emails from './controllers/emails.js';
import { errorHandler, userExtractor } from './util/middleware.js';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  InterServerEvents
} from './types.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
  server,
  { path: '/api/chat', cors: {} }
);

io.use((socket, next): void => {
  const { userId } = socket.handshake.auth;
  if (!userId) {
    return next(new Error('invalid username'));
  }
  socket.data.userId = String(userId);
  return next();
});

io.on('connection', async (socket): Promise<void> => {
  const { userId } = socket.handshake.auth;
  if (!userId || !isString(userId)) {
    throw new Error('invalid username');
  }
  socket.join(userId);

  socket.on('message', ({ text, userId, createdAt, images }): void => {
    socket.broadcast.to(userId).emit('message', { text, createdAt, images });
  });

  socket.on('join', (userId): void => {
    socket.join(userId);
  });

  socket.on('leave', (userId): void => {
    socket.leave(userId);
  });
});

app.use('/api/login', login);
app.use('/api/categories', categories);
app.use('/api/passwords', passwords);
app.use('/api', tokens);
app.use('/api/emails', emails);
app.use(userExtractor);
app.use('/api/chatinfo', chatInfo);
app.use('/api/chats', chats);
app.use('/api/favorites', favorites);
app.use('/api', follows);
app.use('/api/images', images);
app.use('/api/messages', messages);
app.use('/api/posts', posts);
app.use('/api/users', users);
app.use(errorHandler);

const start = async (): Promise<void> => {
  await connectToDatabase();
  server.listen(8080, (): void => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
