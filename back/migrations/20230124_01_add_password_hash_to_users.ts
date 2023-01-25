// eslint-disable-next-line import/no-import-module-exports
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('users', 'password_hash', {
      type: DataTypes.STRING,
      allowNull: false
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('users', 'password_hash');
  }
};
