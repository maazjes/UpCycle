const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('categories', 'depth', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('categories', 'depth');
  }
};
