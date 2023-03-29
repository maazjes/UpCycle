// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('images', 'width');
    await queryInterface.removeColumn('images', 'height');
    await queryInterface.changeColumn('images', 'uri', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('images', 'width', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [2, 3]
      }
    });
    await queryInterface.addColumn('images', 'height', {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [2, 3]
      }
    });
    await queryInterface.changeColumn('images', 'uri', {
      type: DataTypes.STRING,
      allowNull: true
    });
  }
};
