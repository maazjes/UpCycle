const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('posts', 'condition', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['New', 'Slightly used', 'Used']]
      }
    });
    await queryInterface.addColumn('posts', 'postcode', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 5]
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('posts', 'condition');
    await queryInterface.removeColumn('posts', 'postcode');
  }
};
