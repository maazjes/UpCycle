import User from './user.js';
import Post from './post.js';
import Category from './category.js';
import Image from './image.js';
import Favorite from './favorite.js';
import Message from './message.js';
import Chat from './chat.js';
import Follow from './follow.js';
import PostCategory from './postCategory.js';
import ChatInfo from './chatInfo.js';

Category.hasMany(Category, { foreignKey: 'parentCategoryId', as: 'subcategories' });
Category.belongsTo(Category, { foreignKey: 'parentCategoryId' });

Post.belongsToMany(Category, { through: PostCategory });

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Image, { foreignKey: 'postId' });
Image.belongsTo(Post, { foreignKey: 'postId' });
Message.hasMany(Image, { foreignKey: 'messageId' });
Image.belongsTo(Message, { foreignKey: 'messageId' });

Post.hasMany(Favorite, { foreignKey: 'postId' });

Chat.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Message.hasOne(Chat, { foreignKey: 'lastMessageId', as: 'lastMessage' });
Chat.belongsTo(Message, { foreignKey: 'lastMessageId', as: 'lastMessage' });

Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers' });

Post.hasMany(PostCategory, { foreignKey: 'postId' });

Chat.hasOne(ChatInfo, { foreignKey: 'chatId', as: 'info' });

export { Post, User, Category, Image, Favorite, Chat, Message, Follow, PostCategory, ChatInfo };
