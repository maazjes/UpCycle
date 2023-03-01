import {
  Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey
} from 'sequelize';
import { sequelize } from '../util/db.js';
import { User, Chat } from './index.js';

class Message extends Model<
InferAttributes<Message>, InferCreationAttributes<Message>
> {
  declare id: CreationOptional<number>;

  declare receiverId: ForeignKey<User['id']>;

  declare senderId: ForeignKey<User['id']>;

  declare chatId: ForeignKey<Chat['id']>;

  declare content: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
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
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'message'
  }
);

export default Message;
