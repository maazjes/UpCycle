import User from './user.js';
import Post from './post.js';
import Category from './category.js';
import Image from './image.js';
import Favorite from './favorite.js';
import Message from './message.js';
import Chat from './chat.js';
import Follow from './follow.js';
import PostCategory from './postCategory.js';

Category.hasMany(Category, { foreignKey: 'parentCategoryId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentCategoryId' });

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Image, { foreignKey: 'postId' });
Image.belongsTo(Post, { foreignKey: 'postId' });

Post.hasMany(Favorite, { foreignKey: 'postId' });
Favorite.belongsTo(Post, { foreignKey: 'postId' });

Chat.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });

export {
  Post,
  User,
  Category,
  Image,
  Favorite,
  Chat,
  Message,
  Follow,
  PostCategory
};
