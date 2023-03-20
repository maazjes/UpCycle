// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.addColumn('images', 'message_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'messages', key: 'id' }
    });
    await queryInterface.addColumn('messages', 'text', {
      type: DataTypes.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn(
      'images',
      'post_id',
      {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    );
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('images', 'message_id');
    await queryInterface.removeColumn('messages', 'text');
    await queryInterface.changeColumn(
      'images',
      'post_id',
      {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    );
  }
};
