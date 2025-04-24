
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  brand?: string;
  features?: string[];
  isNew?: boolean;
  isSale?: boolean;
  discount?: number;
}