import { CategoryEntity } from '../../types/entity.types';
import { NewEntity } from '../NewEntity';
import { Task } from '../Task';
import { CategoryContainer, CategoryTitle, TasksList } from './Category.styles';

interface CategoryProps {
  category: CategoryEntity;
}
export function Category({ category }: CategoryProps) {
  return (
    <CategoryContainer>
      <CategoryTitle>{category.title}</CategoryTitle>
      <TasksList>
        {category.tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
        <NewEntity buttonText="+ Create a Task" />
      </TasksList>
    </CategoryContainer>
  );
}

export default Category;
