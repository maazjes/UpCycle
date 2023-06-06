const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'username', {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [2, 30]
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'username');
  }
};
