require('dotenv').config();

const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || 'susanna';

export {
  DATABASE_URL,
  PORT,
  SECRET
};
