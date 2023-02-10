import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional
} from 'sequelize';
import { sequelize } from '../util/db.js';

class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare subcategoryId: CreationOptional<number>;
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
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'categories', key: 'id' }
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
