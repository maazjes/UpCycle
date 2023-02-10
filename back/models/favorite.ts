import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional
} from 'sequelize';
import { sequelize } from '../util/db.js';

class Favorite extends Model<
InferAttributes<Favorite>, InferCreationAttributes<Favorite>
> {
  declare id: CreationOptional<number>;

  declare postId: number;

  declare userId: string;
}

Favorite.init(
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'favorite'
  }
);

export default Favorite;
