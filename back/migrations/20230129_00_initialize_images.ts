// @ts-ignore
const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.createTable('images', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uri: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isUrl: true
        }
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'posts', key: 'id' }
      }
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.dropTable('images');
  }
};
