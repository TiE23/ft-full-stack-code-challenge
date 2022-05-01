import { EntityId } from './entity.types';

interface DragItemBase {
  id: EntityId;
  type: string;
}

export interface CategoryDragItem extends DragItemBase {
  type: 'CATEGORY';
}

export interface TaskDragItem extends DragItemBase {
  parentCategoryId: EntityId;
  type: 'TASK';
}

export type DragItem = CategoryDragItem | TaskDragItem;
