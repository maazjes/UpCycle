import User from './user.js';
import Post from './post.js';
import Category from './category.js';
import Image from './image.js';
import Favorite from './favorite.js';
import Message from './message.js';
import Chat from './chat.js';

User.hasMany(Post);
Post.belongsTo(User);

Category.hasMany(Post);
Post.belongsTo(Category);

Post.hasMany(Image);
Image.belongsTo(Post);

User.belongsToMany(Post, { through: Favorite, as: 'favorites' });

Chat.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export {
  Post,
  User,
  Category,
  Image,
  Favorite,
  Chat,
  Message
};
