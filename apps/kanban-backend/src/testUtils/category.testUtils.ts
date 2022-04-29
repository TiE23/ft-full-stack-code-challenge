import { DeepPartial } from 'typeorm';
import { CategoryEntity } from '../category/entities/category.entity';

/**
 * Easily generate new Category entities with partial data for testing purposes.
 * @param categoryData
 * @returns
 */
export function categoryFactory(
  categoryData: DeepPartial<CategoryEntity>
): CategoryEntity {
  const newCategory = new CategoryEntity();
  Object.assign(newCategory, categoryData);
  return newCategory;
}
