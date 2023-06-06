const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('posts', 'description', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 3000]
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('posts', 'description');
  }
};
