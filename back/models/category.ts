import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey
} from 'sequelize';
import { sequelize } from '../util/db.js';

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare parentCategoryId: CreationOptional<ForeignKey<Category['id']>> | null;

  declare depth: number;

  declare subcategories?: Category[];
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    parentCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' }
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 100
      }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'category'
  }
);

export default Category;
