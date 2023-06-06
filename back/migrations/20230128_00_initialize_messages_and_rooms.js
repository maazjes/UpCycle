const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
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
        archived: {
          type: DataTypes.BOOLEAN,
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
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 1000]
        }
      }
    });
    await queryInterface.addColumn('chats', 'last_message_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'messages', key: 'id' }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('chats', 'last_message_id');
    await queryInterface.dropTable('messages');
    await queryInterface.dropTable('chats');
  }
};
