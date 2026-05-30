import api from './api';
import type { Category, CreateCategoryRequest, APIResponse } from '@/types';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<APIResponse<Category[]>>('/categories');
    return data.data;
  },

  async createCategory(payload: CreateCategoryRequest): Promise<Category> {
    const { data } = await api.post<APIResponse<Category>>('/admin/categories', payload);
    return data.data;
  },

  async updateCategory(id: number, payload: Partial<CreateCategoryRequest>): Promise<Category> {
    const { data } = await api.put<APIResponse<Category>>(`/admin/categories/${id}`, payload);
    return data.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/admin/categories/${id}`);
  },
};