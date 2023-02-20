import User from './user.js';
import Post from './post.js';
import Category from './category.js';
import Image from './image.js';
import Favorite from './favorite.js';
import Message from './message.js';
import Room from './room.js';

User.hasMany(Post);
Post.belongsTo(User);

Category.hasMany(Post);
Post.belongsTo(Category);

Post.hasMany(Image);
Image.belongsTo(Post);

User.belongsToMany(Post, { through: Favorite, as: 'favorites' });

User.belongsToMany(User, { through: Room, as: 'rooms' });
User.hasMany(Message);

export {
  Post,
  User,
  Category,
  Image,
  Favorite
};
