import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey
} from 'sequelize';
import { sequelize } from '../util/db.js';
import { Post } from './index.js';

class Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
  declare id: CreationOptional<number>;

  declare uri: string;

  declare width: number;

  declare height: number;

  declare postId: ForeignKey<Post['id']>;

  declare messageId: ForeignKey<Image['id']>;
}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uri: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'posts', key: 'id' }
    },
    messageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'images', key: 'id' }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'image'
  }
);

export default Image;
