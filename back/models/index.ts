import User from './user.js';
import Post from './post.js';
import Category from './category.js';
import Image from './image.js';
import Favorite from './favorite.js';

User.hasMany(Post);
Post.belongsTo(User);

Category.hasMany(Post);
Post.belongsTo(Category);

Post.hasMany(Image);
Image.belongsTo(Post);

User.belongsToMany(Post, { through: Favorite, as: 'favorites' });

export {
  Post,
  User,
  Category,
  Image,
  Favorite
};
