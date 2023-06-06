const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('categories', 'parent_category_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('categories', 'parent_category_id');
  }
};
