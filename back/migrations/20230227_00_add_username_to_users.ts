// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('users', 'username', {
      type: DataTypes.STRING,
      unique: true
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('users', 'username');
  }
};
