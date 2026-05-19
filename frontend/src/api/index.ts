import api from './client';
import { AuthData, Product, Category, User, ProductFormData, ProductStats, UserStats } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthData }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ success: boolean; data: AuthData }>('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const productsApi = {
  getAll: (params?: { categoryId?: number; active?: boolean; search?: string }) =>
    api.get<{ success: boolean; data: Product[] }>('/products', { params }),
  getById: (id: number) => api.get<{ success: boolean; data: Product }>(`/products/${id}`),
  create: (data: ProductFormData) => api.post<{ success: boolean; data: Product }>('/products', data),
  update: (id: number, data: Partial<ProductFormData>) =>
    api.put<{ success: boolean; data: Product }>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
  getStats: () => api.get<{ success: boolean; data: ProductStats }>('/products/stats'),
};

export const categoriesApi = {
  getAll: () => api.get<{ success: boolean; data: Category[] }>('/categories'),
  create: (data: { name: string; description?: string }) => api.post('/categories', data),
  update: (id: number, data: { name?: string; description?: string }) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const usersApi = {
  getAll: () => api.get<{ success: boolean; data: User[] }>('/users'),
  getStats: () => api.get<{ success: boolean; data: UserStats }>('/users/stats'),
  changeRole: (id: number, role: 'ADMIN' | 'USER') => api.patch(`/users/${id}/role`, { role }),
  delete: (id: number) => api.delete(`/users/${id}`),
};
