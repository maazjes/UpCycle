// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('posts', 'description', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [0, 3000]
      }
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('posts', 'description');
  }
};
