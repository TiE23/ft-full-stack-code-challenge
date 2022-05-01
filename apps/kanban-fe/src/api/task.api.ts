import { CategoryEntity } from './category.api';

export interface TaskEntity {
  id: number;
  title: string;
  category: CategoryEntity;
  lexical_order: string;
  created_at: string;
  updated_at: string;
}
