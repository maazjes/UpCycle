import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional
} from 'sequelize';
import { sequelize } from '../util/db.js';

class Message extends Model<
InferAttributes<Message>, InferCreationAttributes<Message>
> {
  declare id: CreationOptional<number>;

  declare receiverId: string;

  declare senderId: string;

  declare chatId: number;

  declare content: string;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    senderId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    receiverId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: 'chats', key: 'id' }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'message'
  }
);

export default Message;
