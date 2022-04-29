import { Category } from '../category/entities/category.entity';
import { SortDirection } from '../types/utils.types';
import { lexicallySortEntities } from './common.utils';

/**
 * Modifies the provided Category and updates its Tasks by sorting them in the
 * direction specified.
 * @param category
 * @param sortDirection
 */
export function sortTasksInCategory(
  category: Category,
  sortDirection: SortDirection
): void {
  if (!category.tasks) {
    // This can happen if you set loadEagerRelations to false in a find query.
    throw new ReferenceError('Category does not have any Tasks property.');
  }
  category.tasks = lexicallySortEntities(category.tasks, sortDirection);
}
