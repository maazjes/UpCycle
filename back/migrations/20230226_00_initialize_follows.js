const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable(
      'follows',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        follower_id: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        following_id: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        }
      },
      { uniqueKeys: { uniqueIds: { fields: ['follower_id', 'following_id'] } } }
    );
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('follows');
  }
};
