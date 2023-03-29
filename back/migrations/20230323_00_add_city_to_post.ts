// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');
const cities: string[] = require('../assets/cities.json');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('posts', 'city', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [cities]
      }
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('posts', 'city');
  }
};
