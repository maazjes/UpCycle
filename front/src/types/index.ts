import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export interface PostBase {
  id: number;
  images: TypedImage[];
  title: string;
  price: string;
}

export interface Favorite {
  id: number;
  postId: number;
  userId: number;
}

export interface Post extends PostBase {
  description: string;
  category: string;
  postcode: string;
  condition: Condition;
  user: User;
  favoriteId: null | number;
}

export enum Condition {
  new = 'new',
  slightlyUsed = 'slightly used',
  used = 'used'
}

export interface Location {
  city: string;
  postcode: string;
}

export interface Category {
  id: number;
  name: string;
  subcategory?: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl: string | null;
  bio: string | null;
  username: string;
  posts: PostBase[];
  following?: boolean;
}

export interface ErrorResponse {
  error: string;
}

export interface NotificationState {
  message: string;
  error: boolean;
}

export interface TypedImage {
  width: number;
  height: number;
  uri: string;
  id: string;
}

interface PaginationBase {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface PostsResponse extends PaginationBase {
  posts: PostBase[];
}

export interface MessagesResponse extends PaginationBase {
  messages: Message[];
}

export type GetPostsParams = {
  page?: number;
  size?: number;
  userId?: string;
  postId?: number;
  favorite?: boolean;
};

export type GetUsersParams = {
  userId?: string;
  role?: 'follower' | 'followed';
};

export interface Chat {
  id: number;
  creator: User;
  user: User;
}

export interface Message {
  id: number;
  chatId: number;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export type NewPostProps = Omit<PostBase, 'user' | 'id' | 'favoriteId'>;

export type UpdatePostProps = Partial<NewPostProps>;

export interface InitialPostValues {
  title: string;
  price: string;
  images: TypedImage[];
  description: string;
  postcode: string;
  category: string;
  condition: Condition;
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type LoginStackParams = {
  'Login': undefined;
  'SignUp': undefined;
};

export type UserStackParams = {
  'StackHome': undefined;
  'StackFavorites': { userId: string };
  'StackCreatePost': undefined;
  'StackChat': undefined;
  'SinglePost': { postId: number };
  'StackProfile': { userId: string; username: string };
  'EditPost': { postId: number };
  'EditProfile': { userId: string; bio: string; email: string; displayName: string; photoUrl: string; username: string };
  'Chat': undefined;
  'SingleChat': { userId: string };
};

export type UserTabsParams = {
  'Home': undefined;
  'Favorites': { userId: string };
  'Profile': undefined;
  'CreatePost': undefined;
  'Chat': undefined;
};

export interface ServerToClientEvents {
  message: ({ content, createdAt }: { content: string; createdAt: string }) => void;
}

export interface ClientToServerEvents {
  message: ({ content, chatId, createdAt }:
  { content: string; chatId: number; createdAt: string }) => void;
  join: (chatId: number) => void;
  leave: (chatId: number) => void;

}

export type UserStackNavigation =
CompositeNavigationProp<NativeStackNavigationProp<UserStackParams>,
BottomTabNavigationProp<UserTabsParams>>;

export type LoginStackNavigation = NativeStackNavigationProp<LoginStackParams>;

export type UserStackScreen<S extends keyof UserStackParams> =
NativeStackScreenProps<UserStackParams, S>;
