import {
  CategoryEntity,
  CreateCategoryDto,
  CreateTaskDto,
  TaskEntity,
} from '../types/entity.types';

export function createOptimisticCategory(
  newCategory: CreateCategoryDto
): CategoryEntity {
  return {
    ...newCategory,
    tasks: [],
    lexical_order: '',
    id: 0,
    created_at: '',
    updated_at: '',
  };
}

export function createOptimisticTask(newTask: CreateTaskDto): TaskEntity {
  return {
    ...newTask,
    category: createOptimisticCategory({ title: '' }),
    lexical_order: '',
    id: 0,
    created_at: '',
    updated_at: '',
  };
}
