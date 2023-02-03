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
  id: number;
  name: string;
  username: string;
  token: string;
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
  url: string;
  tempId?: string;
}

export type NewPostProps = Omit<PostBase, 'user' | 'id'>;
