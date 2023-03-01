
export interface UserBase {
  id: string;
  displayName: string;
  username: string;
  photoUrl: string;
}

export interface PaginationBase {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface BioUser extends UserBase {
  bio: string;
}

export interface EmailUser extends BioUser {
  email: string;
}

export interface PostsUser extends UserBase {
  posts: PostBase[]
}

export interface FollowUser extends UserBase {
  followId: number;
  following: boolean;
}

export interface ChatUser extends UserBase {
  chatId: number;
}

export interface TokenUser extends EmailUser {
  idToken: string;
  refreshToken: string;
}

export interface UserPages extends PaginationBase {
  users: FollowUser[] | ChatUser[]
}

export interface NewUserBody extends Omit<EmailUser, 'id'> {
  password: string;
}

export interface UpdateUserBody extends Partial<NewUserBody> {}

export interface Image {
  width: number;
  height: number;
  uri: string;
  id: number;
}

export interface PostBase {
  id: number;
  images: Image[];
  title: string;
  price: string;
}

export type SharedGetPostsQuery = {
  userId?: string;
  favorite?: 'true';
};

export type SharedGetMessagesQuery = {
  userId1: string;
  userId2: string;
}

export type SharedGetUsersQuery = {
  followedId: string;
  followerId: string;
  chats: 'true';
}

export interface Post extends PostBase {
  description: string;
  condition: Condition;
  postcode: string;
  userId: string;
  categoryId: number;
  favoriteId: number | null;
}

export interface UpdatePostBody extends Partial<NewPostBody> {}

export enum Condition {
  new = 'new',
  slightlyUsed = 'slightly used',
  used = 'used'
}

export interface NewPostBody {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: Condition;
  postcode: string;
}

export interface PostPages extends PaginationBase {
  posts: PostBase[]
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  subcategory?: number;
}

export interface Favorite {
  id: number;
  postId: number;
  userId: string;
}

export interface Follow {
  id: number;
  followerId: string;
  followedId: string;
}

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

export interface MessagePages extends PaginationBase {
  messages: Message[]
}

export interface ErrorBody {
  error: string;
}

export interface Chat {
  id: number;
  creatorId: string;
  userId: string;
  lastMessage: string;
  creator: UserBase;
  user: UserBase;
}