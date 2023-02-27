import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional
} from 'sequelize';
import { sequelize } from '../util/db.js';

class Follow extends Model<
InferAttributes<Follow>, InferCreationAttributes<Follow>
> {
  declare id: CreationOptional<number>;

  declare followerId: string;

  declare followedId: string;
}

Follow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    followerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    followedId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'follow'
  }
);

export default Follow;
