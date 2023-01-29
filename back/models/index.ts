import User from './user';
import Post from './post';
import Category from './category';
import Image from './image';
import Location from './location';

User.hasMany(Post);
Post.belongsTo(User);
Category.hasMany(Post);
Post.belongsTo(Category);
Image.hasOne(Post);
Location.hasOne(Post);

export {
  Post,
  User,
  Category,
  Image,
  Location
};
