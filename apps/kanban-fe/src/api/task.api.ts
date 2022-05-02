import apiClient from './api';
import { EntityId, TaskEntity, UpdateTaskDto } from '../types/entity.types';
import { DeleteResult } from '../types/api.types';

export interface updateTaskVariables {
  taskId: EntityId;
  categoryId: EntityId; // Only used in Mutation.
  updateTaskDto: UpdateTaskDto;
}
export async function updateTask({
  taskId,
  updateTaskDto,
}: updateTaskVariables): Promise<TaskEntity> {
  const response = await apiClient.patch<TaskEntity>(
    `/task/${taskId}`,
    updateTaskDto
  );
  return response.data;
}

export interface moveAndRepositionTaskVariables {
  taskId: EntityId;
  fromCategoryId: EntityId; // Only used in Mutation.
  toCategoryId: EntityId;
  newPosition: number;
}
export async function moveAndRepositionTask({
  taskId,
  toCategoryId,
  newPosition,
}: moveAndRepositionTaskVariables): Promise<TaskEntity> {
  const response = await apiClient.patch<TaskEntity>(
    `/task/${taskId}/moveto/${toCategoryId}/${newPosition}`
  );
  return response.data;
}

export interface deleteTaskVariables {
  taskId: EntityId;
  categoryId: EntityId; // Only used in Mutation.
}
export async function deleteTask({
  taskId,
}: deleteTaskVariables): Promise<DeleteResult> {
  const response = await apiClient.delete<DeleteResult>(`/task/${taskId}`);
  return response.data;
}
