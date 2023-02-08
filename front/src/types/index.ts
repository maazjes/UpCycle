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
  id: number;
  name: string;
  username: string;
  token: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
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
  userId?: number;
  postId?: number;
};

export type GetUsersParams = {
  userId?: number;
};

export type NewPostProps = Omit<PostBase, 'user' | 'id' | 'images'> & { images: TypedImage[] };

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
