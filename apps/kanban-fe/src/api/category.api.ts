import apiClient from './api';
import { TaskEntity } from './task.api';

export interface CategoryEntity {
  id: number;
  title: string;
  tasks: TaskEntity[];
  lexical_order: string;
  created_at: string;
  updated_at: string;
}

export async function getAllCategories() {
  const response = await apiClient.get<CategoryEntity[]>('/category');
  return response.data;
}
