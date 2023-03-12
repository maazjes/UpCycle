import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey
} from 'sequelize';
import { sequelize } from '../util/db.js';
import { Post, Category } from './index.js';

class PostCategory extends Model<InferAttributes<PostCategory>,
InferCreationAttributes<PostCategory>> {
  declare id: CreationOptional<number>;

  declare postId: ForeignKey<Post['id']>;

  declare categoryId: ForeignKey<Category['id']>;
}

PostCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'posts', key: 'id' }
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
    timestamps: false,
    modelName: 'postCategory'
  }
);

export default PostCategory;
