import { useQueryClient } from 'react-query';

import CategoryMutations from '../../mutations/category.mutations';
import { EntityType } from '../../types/api.types';
import { CategoryEntity, EntityId } from '../../types/entity.types';

import { MoveAndDeleteControls } from '../Common';
import { NewEntity } from '../NewEntity';
import { Task } from '../Task';
import {
  CategoryContainer,
  CategoryTitle,
  CategoryTitleRow,
  TasksList,
} from './Category.styles';

interface CategoryProps {
  category: CategoryEntity;
  categoryIndex: number;
  leftCategoryId?: EntityId;
  rightCategoryId?: EntityId;
}
export function Category({
  category,
  categoryIndex,
  leftCategoryId,
  rightCategoryId,
}: CategoryProps) {
  const queryClient = useQueryClient();

  const categoryMutations = new CategoryMutations(queryClient);

  return (
    <CategoryContainer>
      <CategoryTitleRow>
        <CategoryTitle>{category.title}</CategoryTitle>
        <MoveAndDeleteControls
          disableMoveLeft={leftCategoryId == null}
          disableMoveRight={rightCategoryId == null}
          moveLeft={() =>
            categoryMutations.repositionCategoryMutation.mutate({
              categoryId: category.id,
              newPosition: categoryIndex - 1,
            })
          }
          moveRight={() =>
            categoryMutations.repositionCategoryMutation.mutate({
              categoryId: category.id,
              newPosition: categoryIndex + 1,
            })
          }
          trash={() =>
            categoryMutations.deleteCategoryMutation.mutate({
              categoryId: category.id,
            })
          }
        />
      </CategoryTitleRow>
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
