const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();
const url = process.env.DATABASE_URL ? process.env.DATABASE_URL : '';
const sequelize = new Sequelize(url, {});

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
