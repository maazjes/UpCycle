const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('favorites', {
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
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('favorites');
  }
};
