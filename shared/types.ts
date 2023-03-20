// Users

export interface UserBase {
  id: string;
  displayName: string;
  username: string;
  photoUrl: string;
}

export interface BioUser extends UserBase {
  bio: string;
}

export interface RawUser extends BioUser {
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailUser extends BioUser {
  email: string;
}

export interface PostsUser extends UserBase {
  posts: PostBase[];
}

export interface TokenUser extends EmailUser {
  idToken: string;
  refreshToken: string;
}

export interface User extends EmailUser {
  followers: number;
  following: number;
  followId: number | null;
}

export interface SharedNewUserBody extends Omit<EmailUser, 'id' | 'photoUrl'> {
  password: string;
}

export interface SharedUpdateUserBody extends Partial<SharedNewUserBody> {}

// Posts

export interface PostBase {
  id: number;
  images: TypedImage[];
  title: string;
  price: string;
}

export interface Post extends PostBase {
  description: string;
  condition: Condition;
  postcode: string;
  user: UserBase;
  categories: Category[];
  favoriteId: number | null;
}

export interface SharedNewPostBody {
  title: string;
  description: string;
  price: string;
  condition: Condition;
  postcode: string;
}

export interface PostPage extends PaginationBase {
  data: PostBase[];
}

export type SharedGetPostsQuery = {
  userId?: string;
  categoryId?: string;
  favorite?: 'true';
  contains?: string;
};

// Images

export interface TypedImage {
  width: number;
  height: number;
  uri: string;
  id: number;
}

// Messages

export interface Message {
  id: number;
  receiverId: string;
  senderId: string;
  chatId: number;
  text: string;
  images: TypedImage[]
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageBody {
  receiverId: string;
  text: string;
  images?: TypedImage[]
}

export interface MessagePage extends PaginationBase {
  data: Message[];
}

export type SharedGetMessagesQuery = {
  userId1: string;
  userId2: string;
};

// Follows

export interface FollowBase {
  id: number;
  followerId: string;
}

export interface Follow extends FollowBase {
  followingId: string;
}

export interface Following extends FollowBase {
  following: UserBase;
}

export interface Follower extends FollowBase {
  follower: UserBase;
}

export interface FollowingPage extends PaginationBase {
  data: Following[];
}

export interface FollowerPage extends PaginationBase {
  data: Follower[];
}

// Chats

export interface Chat {
  id: number;
  lastMessage: Message;
  user: UserBase;
}

export interface ChatPage extends PaginationBase {
  data: Chat[];
}

// Categories

export interface Category {
  id: number;
  name: string;
  subcategories: Category[];
}

// Favorites

export interface Favorite {
  id: number;
  postId: number;
  userId: string;
}

// Images

export interface ImageBody {

}

// Misc

export interface ErrorBody {
  error: string;
}

export enum Condition {
  new = 'new',
  slightlyUsed = 'slightly used',
  used = 'used'
}

export interface EmailBody {
  email: string;
}

export interface PasswordResetVerifyBody {
  oobCode: string;
}

export interface PasswordResetConfirmationBody extends PasswordResetVerifyBody {
  newPassword: string;
}

export interface LoginBody extends EmailBody {
  password: string;
}

export interface PaginationBase {
  totalItems: number;
  offset: number;
  data: any[];
}