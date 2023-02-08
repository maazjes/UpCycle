import User from './user';
import Post from './post';
import Category from './category';
import Image from './image';
import Favorite from './favorite';

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
