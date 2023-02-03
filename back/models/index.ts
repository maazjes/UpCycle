import User from './user';
import Post from './post';
import Category from './category';
import Image from './image';

User.hasMany(Post);
Post.belongsTo(User);
Category.hasMany(Post);
Post.belongsTo(Category);
Post.hasMany(Image);
Image.belongsTo(Post);

export {
  Post,
  User,
  Category,
  Image
};
