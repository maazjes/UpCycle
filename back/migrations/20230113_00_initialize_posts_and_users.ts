// @ts-ignore
const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 50]
        }
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // eslint-disable-next-line prettier/prettier, no-useless-escape
          is: ['^\d+€$'],
          len: [2, 7]
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 30]
        }
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 150]
        }
      },
      photo_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true
        }
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    });
    await queryInterface.addColumn('posts', 'user_id', {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    });
  },
  down: async ({ context: queryInterface }: { context: typeof QueryInterface }): Promise<void> => {
    await queryInterface.removeColumn('posts', 'user_id');
    await queryInterface.dropTable('posts');
    await queryInterface.dropTable('users');
  }
};
