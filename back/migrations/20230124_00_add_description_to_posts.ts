// @ts-ignore
const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('posts', 'description', {
      type: DataTypes.STRING,
      allowNull: false
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('posts', 'description');
  }
};
