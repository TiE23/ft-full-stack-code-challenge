import apiClient from './api';
import { EntityId, TaskEntity, UpdateTaskDto } from '../types/entity.types';
import { DeleteResult } from '../types/api.types';

export async function updateTask(
  taskId: EntityId,
  updateTaskDto: UpdateTaskDto
): Promise<TaskEntity> {
  const response = await apiClient.patch<TaskEntity>(
    `/task/${taskId}`,
    updateTaskDto
  );
  return response.data;
}

export async function moveAndRepositionTask(
  taskId: EntityId,
  categoryId: EntityId,
  newPosition: number
): Promise<TaskEntity> {
  const response = await apiClient.patch<TaskEntity>(
    `/task/${taskId}/moveto/${categoryId}/${newPosition}`
  );
  return response.data;
}

export async function deleteTask(taskId: EntityId): Promise<DeleteResult> {
  const response = await apiClient.delete<DeleteResult>(`/task/${taskId}`);
  return response.data;
}
