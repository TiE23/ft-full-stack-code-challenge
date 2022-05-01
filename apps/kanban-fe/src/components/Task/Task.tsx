import { TaskEntity } from '../../types/entity.types';
import { TaskContainer, TaskTitle } from './Task.styles';

export interface TaskProps {
  task: TaskEntity;
}

export function Task({ task }: TaskProps) {
  return (
    <TaskContainer>
      <TaskTitle>{task.title}</TaskTitle>
    </TaskContainer>
  );
}

export default Task;
