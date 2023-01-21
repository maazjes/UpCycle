export interface PostBase {
  id: number;
  imageUrl: string;
  title: string;
  price: string;
}

export interface Category {
  id: number;
  name: string;
  subcategory?: number;
}
