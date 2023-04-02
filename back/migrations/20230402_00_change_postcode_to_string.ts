// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.changeColumn('posts', 'postcode', {
      type: DataTypes.STRING
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.changeColumn('posts', 'postcode', {
      type: DataTypes.INTEGER
    });
  }
};
