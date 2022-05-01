import apiClient from './api';
import {
  CategoryEntity,
  CreateCategoryDto,
  CreateTaskDto,
  EntityId,
  UpdateCategoryDto,
} from '../types/entity.types';
import { DeleteResult } from '../types/api.types';

export interface createCategoryVariables {
  createCategoryDto: CreateCategoryDto;
}
export async function createCategory({
  createCategoryDto,
}: createCategoryVariables): Promise<CategoryEntity> {
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

export interface getOneCategoryVariables {
  categoryId: EntityId;
}
export async function getOneCategory({
  categoryId,
}: getOneCategoryVariables): Promise<CategoryEntity> {
  const response = await apiClient.get<CategoryEntity>(
    `/category/${categoryId}`
  );
  return response.data;
}

export interface updateCategoryVariables {
  categoryId: EntityId;
  updateCategoryDto: UpdateCategoryDto;
}
export async function updateCategory({
  categoryId,
  updateCategoryDto,
}: updateCategoryVariables): Promise<CategoryEntity> {
  const response = await apiClient.patch(
    `/category/${categoryId}`,
    updateCategoryDto
  );
  return response.data;
}

export interface repositionCategoryVariables {
  categoryId: EntityId;
  newPosition: number;
}
export async function repositionCategory({
  categoryId,
  newPosition,
}: repositionCategoryVariables): Promise<CategoryEntity> {
  const response = await apiClient.patch(
    `/category/${categoryId}/repositionto/${newPosition}`
  );
  return response.data;
}

export interface addTaskVariables {
  categoryId: EntityId;
  createTaskDto: CreateTaskDto;
}
export async function addTask({
  categoryId,
  createTaskDto,
}: addTaskVariables): Promise<CategoryEntity> {
  const response = await apiClient.post(
    `/category/${categoryId}/addtask`,
    createTaskDto
  );
  return response.data;
}

export interface deleteCategoryVariables {
  categoryId: EntityId;
}
export async function deleteCategory({
  categoryId,
}: deleteCategoryVariables): Promise<DeleteResult> {
  const response = await apiClient.delete<DeleteResult>(
    `/category/${categoryId}`
  );
  return response.data;
}
