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
  category: Category;
  favoriteId: number | null;
}

export interface SharedNewPostBody {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: Condition;
  postcode: string;
}

export interface SharedUpdatePostBody extends Partial<SharedNewPostBody> {}

export interface PostPage extends PaginationBase {
  data: PostBase[];
}

export type SharedGetPostsQuery = {
  userId?: string;
  favorite?: 'true';
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
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageBody {
  receiverId: string;
  content: string;
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
  lastMessage: string;
  user: UserBase;
}

export interface ChatPage extends PaginationBase {
  data: Chat[];
}

// Categories

export interface Category {
  id: number;
  name: string;
  subcategoryId: number | null;
}

// Favorites

export interface Favorite {
  id: number;
  postId: number;
  userId: string;
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

export interface LoginBody {
  email: string;
  password: string;
}

export interface PaginationBase {
  totalItems: number;
  offset: number;
  data: any[];
}