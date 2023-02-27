// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
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
        followed_id: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        }
      }
    );
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.dropTable('follows');
  }
};
