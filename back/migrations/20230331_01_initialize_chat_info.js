const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('chats', 'archived');
    await queryInterface.createTable('chat_info', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chats', key: 'id' }
      },
      archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('chats', 'archived', {
      type: DataTypes.BOOLEAN,
      allowNull: false
    });
    await queryInterface.dropTable('chat_info');
  }
};
