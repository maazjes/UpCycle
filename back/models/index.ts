import User from './user';
import Post from './post';
import Category from './category';

User.hasMany(Post);
Post.belongsTo(User);
Category.hasMany(Post);
Post.belongsTo(Category);

export {
  Post,
  User,
  Category
};
