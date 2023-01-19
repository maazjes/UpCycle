import User from './user';
import Post from './post';

User.hasMany(Post);
Post.belongsTo(User);

export {
  Post,
  User
};
