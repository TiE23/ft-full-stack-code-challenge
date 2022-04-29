import { DeepPartial } from 'typeorm';
import { Category } from '../category/entities/category.entity';

/**
 * Easily generate new Category entities with partial data for testing purposes.
 * @param categoryData
 * @returns
 */
export function categoryFactory(categoryData: DeepPartial<Category>): Category {
  const newCategory = new Category();
  Object.assign(newCategory, categoryData);
  return newCategory;
}
