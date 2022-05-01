import { CategoryEntity } from '../../types/entity.types';
import { Task } from '../Task';
import { CategoryContainer, CategoryTitle, TasksList } from './Category.styles';

interface CategoryProps {
  category: CategoryEntity;
}
export function Category({ category }: CategoryProps) {
  console.table(category);
  return (
    <CategoryContainer>
      <CategoryTitle>{category.title}</CategoryTitle>
      <TasksList>
        {category.tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </TasksList>
    </CategoryContainer>
  );
}

export default Category;
