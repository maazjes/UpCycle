const { DataTypes } = require('sequelize');

const cities = require('../assets/cities.json');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('posts', 'city', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [cities]
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('posts', 'city');
  }
};
