// eslint-disable-next-line import/no-import-module-exports
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
    await queryInterface.createTable('locations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      postcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: [5, 5]
        }
      }
    });
    await queryInterface.addColumn('posts', 'condition', {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['new', 'slightly used', 'used']]
      }
    });
    await queryInterface.addColumn('posts', 'location_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'locations', key: 'id' }
    });
  },
  down: async ({ context: queryInterface }: { context: QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('posts', 'condition');
    await queryInterface.removeColumn('posts', 'location_id');
    await queryInterface.dropTable('locations');
  }
};
