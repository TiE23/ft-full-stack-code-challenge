import { EntityType } from '../../types/api.types';
import { CategoryEntity, EntityId } from '../../types/entity.types';
import { NewEntity } from '../NewEntity';
import { Task } from '../Task';
import { CategoryContainer, CategoryTitle, TasksList } from './Category.styles';

interface CategoryProps {
  category: CategoryEntity;
  leftCategoryId?: EntityId;
  rightCategoryId?: EntityId;
}
export function Category({
  category,
  leftCategoryId,
  rightCategoryId,
}: CategoryProps) {
  return (
    <CategoryContainer>
      <CategoryTitle>{category.title}</CategoryTitle>
      <TasksList>
        {category.tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            categoryId={category.id}
            leftCategoryId={leftCategoryId}
            rightCategoryId={rightCategoryId}
          />
        ))}
        <NewEntity entityType={EntityType.TASK} categoryId={category.id} />
      </TasksList>
    </CategoryContainer>
  );
}

export default Category;
