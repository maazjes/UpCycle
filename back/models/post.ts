import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional
} from 'sequelize';
import { sequelize } from '../util/db.js';
import Image from './image.js';

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;

  declare title: string;

  declare price: string;

  declare description: string;

  declare condition: string;

  declare postcode: string;

  declare userId: string;

  declare categoryId: number;

  declare images?: Image[];

  declare favoriteId?: number | null;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['new', 'slightly used', 'used']]
      }
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 5]
      }
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'categories', key: 'id' }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'post'
  }
);

export default Post;
