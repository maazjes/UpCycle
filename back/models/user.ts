import {
  Model, DataTypes, InferAttributes, InferCreationAttributes
} from 'sequelize';
import { sequelize } from '../util/db.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;

  declare displayName: string;

  declare photoUrl?: string;

  declare bio?: string;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user'
  }
);

export default User;
