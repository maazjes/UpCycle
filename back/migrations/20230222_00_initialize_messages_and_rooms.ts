// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.createTable(
      'chats',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        creator_id: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        user_id: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        last_message: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      { uniqueKeys: { uniqueIds: { fields: ['creator_id', 'user_id'] } } }
    );
    await queryInterface.createTable('messages', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chats', key: 'id' }
      },
      sender_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      receiver_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.dropTable('messages');
    await queryInterface.dropTable('chats');
  }
};
