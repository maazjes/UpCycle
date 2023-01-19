const { DataTypes } = require('sequelize');

export default {
  // @ts-ignore
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      image_url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      price: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    });
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    });
    await queryInterface.addColumn('posts', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    });
  },
  // @ts-ignore
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('posts', 'user_id');
    await queryInterface.dropTable('posts');
    await queryInterface.dropTable('users');
  }
};
