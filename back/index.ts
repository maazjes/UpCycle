const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./util/db');
const postsRouter = require('./controllers/posts');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const imagesRouter = require('./controllers/images');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/images', imagesRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(8080, () => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
