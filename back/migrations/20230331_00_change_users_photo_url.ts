// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.changeColumn('users', 'photo_url', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.changeColumn('users', 'photo_url', {
      type: DataTypes.STRING,
      allowNull: false
    });
  }
};
