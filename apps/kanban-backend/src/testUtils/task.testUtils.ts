import { DeepPartial } from 'typeorm';
import { Task } from '../task/entities/task.entity';

export function taskFactory(task: DeepPartial<Task>): Task {
  const newTask = new Task();
  Object.assign(newTask, task);
  return newTask;
}
