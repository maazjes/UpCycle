import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey
} from 'sequelize';
import { sequelize } from '../util/db.js';
import { User } from './index.js';

class Follow extends Model<
InferAttributes<Follow>, InferCreationAttributes<Follow>
> {
  declare id: CreationOptional<number>;

  declare followerId: ForeignKey<User['id']>;

  declare followedId: ForeignKey<User['id']>;

  declare follower?: User;

  declare followed?: User;
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
