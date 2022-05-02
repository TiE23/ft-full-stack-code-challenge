import { DeepPartial } from 'typeorm';
import { TaskEntity } from '../task/entities/task.entity';

/**
 * Easily generate new Task entities with partial data for testing purposes.
 * @param taskData
 * @returns
 */
export function taskFactory(taskData: DeepPartial<TaskEntity>): TaskEntity {
  const newTask = new TaskEntity();
  Object.assign(newTask, taskData);
  return newTask;
}
