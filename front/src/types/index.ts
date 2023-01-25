export interface PostBase {
  id: number;
  imageUrl: string;
  title: string;
  price: string;
  description: string;
  user: User;
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
