const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('post_categories', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' }
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' }
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('post_categories');
  }
};
