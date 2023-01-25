export interface PostBase {
  id: number;
  imageUrl: string;
  title: string;
  price: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  subcategory?: number;
}

export interface User {
  username: string;
  token: string;
}

export interface State {
  user: User;
}

export interface ErrorResponse {
  error: string;
}
