const express = require('express');
const { connectToDatabase } = require('./util/db');

const app = express();
app.use(express.json());

const start = async () => {
  await connectToDatabase();
  app.listen(8080, () => {
    console.log(`Server running on port ${8080}`);
  });
};

start();
