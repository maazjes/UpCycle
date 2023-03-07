import {
  Model, DataTypes, InferAttributes, InferCreationAttributes,
  CreationOptional, ForeignKey, NonAttribute
} from 'sequelize';
import { Condition } from '@shared/types.js';
import { sequelize } from '../util/db.js';
import { User, Image, Category } from './index.js';

class Post extends Model<
InferAttributes<Post>, InferCreationAttributes<Post>
> {
  declare id: CreationOptional<number>;

  declare title: string;

  declare price: string;

  declare description: string;

  declare condition: Condition;

  declare postcode: string;

  declare userId: ForeignKey<User['id']>;

  declare categoryId: ForeignKey<Category['id']>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare images?: NonAttribute<Image[]>;

  declare user?: NonAttribute<User>;

  declare category?: NonAttribute<Category>;
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
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'post'
  }
);

export default Post;
