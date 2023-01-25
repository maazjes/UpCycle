// eslint-disable-next-line import/no-import-module-exports
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('posts', 'description', {
      type: DataTypes.STRING,
      allowNull: false
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('posts', 'description');
  }
};
