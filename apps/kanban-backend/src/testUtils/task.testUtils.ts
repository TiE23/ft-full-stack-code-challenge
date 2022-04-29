import { DeepPartial } from 'typeorm';
import { Task } from '../task/entities/task.entity';

/**
 * Easily generate new Task entities with partial data for testing purposes.
 * @param taskData
 * @returns
 */
export function taskFactory(taskData: DeepPartial<Task>): Task {
  const newTask = new Task();
  Object.assign(newTask, taskData);
  return newTask;
}
