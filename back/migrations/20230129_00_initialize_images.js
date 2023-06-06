const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(
      'images',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        uri: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
          validate: {
            isUrl: true
          }
        },
        post_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'posts', key: 'id' }
        },
        message_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'messages', key: 'id' }
        }
      },
      { uniqueKeys: { uniqueIds: { fields: ['post_id', 'message_id'] } } }
    );
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('images');
  }
};
