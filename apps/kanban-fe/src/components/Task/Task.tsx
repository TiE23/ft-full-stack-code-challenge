import { TaskEntity } from '../../types/entity.types';
import { TaskContainer } from './Task.styles';

export interface TaskProps {
  task: TaskEntity;
}

export function Task({ task }: TaskProps) {
  return <TaskContainer>{task.title}</TaskContainer>;
}

export default Task;
