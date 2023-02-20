import { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export interface PostBase {
  id: number;
  images: TypedImage[];
  title: string;
  price: string;
  description: string;
  category: string;
  postcode: string;
  condition: Condition;
  user: User;
  favoriteId?: number;
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

export interface TokenUser {
  id: string;
  email: string;
  token: string;
  displayName: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoUrl: string;
  bio: string;
  posts?: PostBase[];
  favorites?: PostBase[];
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

export interface PostsResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  posts: PostBase[] | [];
}

export type GetPostsParams = {
  page?: number;
  size?: number;
  userId?: string;
  postId?: number;
};

export type GetUsersParams = {
  userId?: string;
};

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
  'SinglePost': { postId: number };
  'StackProfile': { userId?: string; displayName?: string };
  'EditPost': { postId: number };
  'EditProfile': { userId: string; bio: string; email: string; displayName: string; photoUrl: string };
};

export type UserTabsParams = {
  'Home': undefined;
  'Favorites': { userId: string };
  'Profile': undefined;
  'CreatePost': undefined;
};

export type UserStackNavigation =
CompositeNavigationProp<NativeStackNavigationProp<UserStackParams>,
BottomTabNavigationProp<UserTabsParams>>;

export type LoginStackNavigation = NativeStackNavigationProp<LoginStackParams>;

export type UserStackScreen<S extends keyof UserStackParams> =
NativeStackScreenProps<UserStackParams, S>;
