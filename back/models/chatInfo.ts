import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';
import { sequelize } from '../util/db.js';

class ChatInfo extends Model<InferAttributes<ChatInfo>, InferCreationAttributes<ChatInfo>> {
  declare id: CreationOptional<number>;

  declare userId: string;

  declare chatId: number;

  declare archived: boolean;
}

ChatInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'chats', key: 'id' }
    },
    archived: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'chatInfo',
    tableName: 'chat_info'
  }
);

export default ChatInfo;
