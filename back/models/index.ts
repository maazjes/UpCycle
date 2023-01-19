import Post from './post';
import User from './user';

User.hasMany(Post);
Post.belongsTo(User);

export {
  Post,
  User
};
