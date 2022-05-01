import {
  CategoryEntity,
  CreateCategoryDto,
  CreateTaskDto,
  TaskEntity,
  UpdateCategoryDto,
  UpdateTaskDto,
} from '../types/entity.types';

export function createOptimisticCategory(
  categoryDto?: CreateCategoryDto | UpdateCategoryDto,
  newTasks?: TaskEntity[]
): CategoryEntity {
  return {
    title: 'Optimistic Category',
    tasks: newTasks || [],
    lexical_order: '',
    id: 0,
    created_at: '',
    updated_at: '',
    ...categoryDto,
  };
}

export function createOptimisticTask(
  taskDto: CreateTaskDto | UpdateTaskDto
): TaskEntity {
  return {
    title: 'Optimistic Task',
    category: createOptimisticCategory({ title: '' }),
    lexical_order: '',
    id: 0,
    created_at: '',
    updated_at: '',
    ...taskDto,
  };
}
