export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface AuthData {
  user: User;
  token: string;
}

export interface ProductStats {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  byCategory: (Category & { _count: { products: number } })[];
}

export interface UserStats {
  totalUsers: number;
  admins: number;
  regularUsers: number;
  recentUsers: User[];
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl: string;
  active: boolean;
}
