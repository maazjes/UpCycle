// Users

export interface UserBase {
  id: string;
  displayName: string;
  username: string;
  photoUrl: string | null;
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

export interface User extends EmailUser {
  followers: number;
  following: number;
  followId: number | null;
}

export interface TokenUser extends User {
  idToken: string;
  refreshToken: string;
}

export interface SharedNewUserBody extends Omit<EmailUser, 'id' | 'photoUrl' | 'email'> {
  password: string;
  email: string;
}

// FirebaseUsers

export interface FirebaseUser {
  id: string;
  email: string;
}

export interface NewFirebaseUserBody extends Partial<Omit<FirebaseUser, 'id'>> {}

// Posts

export interface PostBase {
  id: number;
  images: TypedImage[];
  title: string;
  price: string;
}

export interface Post extends PostBase {
  description: string;
  condition: string;
  postcode: string;
  city: string;
  user: UserBase;
  categories: Category[];
  favoriteId: number | null;
}

export interface SharedNewPostBody {
  title: string;
  description: string;
  price: string;
  condition: string;
  postcode: string;
  city: string;
}

export interface PostPage extends PaginationBase {
  data: PostBase[];
}

export type SharedGetPostsQuery = {
  userId?: string;
  categoryId?: string;
  favorite?: 'true';
  contains?: string;
  condition?: string;
  city?: string;
};

// Images

export interface TypedImage {
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

export interface NewMessageBody {
  receiverId: string;
  text: string;
  images?: string[]
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
  creator: UserBase;
  info: ChatInfoBase
}

export interface RawChat {
  id: number;
  creatorId: number;
  userId: number;
  archived: boolean;
}

export interface ChatPage extends PaginationBase {
  data: Chat[];
}

// ChatInfo

export interface ChatInfoBase {
  id: number;
  archived: boolean;
}

export interface RawChatInfo extends ChatInfoBase {
  userId: string;
  chatId: number;
}

export interface UpdateChatInfoBody {
  archived?: boolean;
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

// Misc

export interface ErrorBody {
  error: string;
}

export type Condition = 'new' | 'slightly used' | 'used';

export interface PasswordResetBody {
  email: string;
}

export interface ExchangeCustomTokenBody {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface PasswordResetVerifyBody {
  oobCode: string;
}

export interface PasswordResetConfirmationBody extends PasswordResetVerifyBody {
  newPassword: string;
}

export interface EmailVerifyBody {
  email: string;
}

export interface CheckEmailVerified {
  verified: boolean;
}

export interface LoginBody {
  email?: string
  username?: string;
  password: string;
}

export interface PaginationBase {
  totalItems: number;
  offset: number;
  data: any[];
}