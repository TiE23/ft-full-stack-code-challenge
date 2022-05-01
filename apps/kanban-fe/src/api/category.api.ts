import apiClient from './api';
import {
  CategoryEntity,
  CreateCategoryDto,
  CreateTaskDto,
  EntityId,
  UpdateCategoryDto,
} from '../types/entity.types';
import { DeleteResult } from '../types/api.types';

export async function createCategory(
  createCategoryDto: CreateCategoryDto
): Promise<CategoryEntity> {
  const response = await apiClient.post<CategoryEntity>(
    '/category',
    createCategoryDto
  );
  return response.data;
}

export async function getAllCategories(): Promise<CategoryEntity[]> {
  const response = await apiClient.get<CategoryEntity[]>('/category');
  return response.data;
}

export async function getOneCategory(
  categoryId: EntityId
): Promise<CategoryEntity> {
  const response = await apiClient.get<CategoryEntity>(
    `/category/${categoryId}`
  );
  return response.data;
}

export async function updateCategory(
  categoryId: EntityId,
  updateCategoryDto: UpdateCategoryDto
): Promise<CategoryEntity> {
  const response = await apiClient.patch(
    `/category/${categoryId}`,
    updateCategoryDto
  );
  return response.data;
}

export async function repositionCategory(
  categoryId: EntityId,
  newPosition: number
): Promise<CategoryEntity> {
  const response = await apiClient.patch(
    `/category/${categoryId}/repositionto/${newPosition}`
  );
  return response.data;
}

export async function addTask(
  categoryId: EntityId,
  createTaskDto: CreateTaskDto
): Promise<CategoryEntity> {
  const response = await apiClient.post(
    `/category/${categoryId}/addtask`,
    createTaskDto
  );
  return response.data;
}

export async function deleteCategory(
  categoryId: EntityId
): Promise<DeleteResult> {
  const response = await apiClient.delete<DeleteResult>(
    `/category/${categoryId}`
  );
  return response.data;
}
