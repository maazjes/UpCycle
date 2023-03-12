// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('categories', 'parent_category_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' }
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('categories', 'parent_category_id');
  }
};
