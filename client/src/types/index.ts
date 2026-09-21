export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: ICategory;
  fabric?: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  _id: string;
  product: IProduct;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  priceAtAddition: number;
}

export interface ICart {
  _id?: string;
  sessionId?: string;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}