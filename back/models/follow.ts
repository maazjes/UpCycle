import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { FollowUserBase } from '@shared/types.js';
import { sequelize } from '../util/db.js';
import { User } from './index.js';

class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>> {
  declare id: CreationOptional<number>;

  declare followerId: ForeignKey<User['id']>;

  declare followingId: ForeignKey<User['id']>;

  declare follower?: FollowUserBase;

  declare following?: FollowUserBase;
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
    followingId: {
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
