/**
 * Common Types
 */
export type EntityId = number;
export type LexicalOrder = string;
export type DateString = string;

/**
 * Shared
 */
export interface CommonEntity {
  id: EntityId;
  created_at: DateString;
  updated_at: DateString;
}
export interface SortableEntity {
  lexical_order: LexicalOrder;
}

/**
 * Category
 */
export interface CategoryEntity extends CommonEntity, SortableEntity {
  title: string;
  tasks: TaskEntity[];
}
export interface CreateCategoryDto {
  title: string;
}
export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

/**
 * Task
 */
export interface TaskEntity extends CommonEntity, SortableEntity {
  title: string;
  category: CategoryEntity;
}
export interface CreateTaskDto {
  title: string;
}
export interface UpdateTaskDto extends Partial<CreateTaskDto> {}
