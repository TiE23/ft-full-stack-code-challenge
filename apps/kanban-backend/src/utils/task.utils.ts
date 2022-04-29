import { Task } from '../task/entities/task.entity';

/**
 * Takes a list of Tasks, copies it, and then sorts it by their lexical_order
 * properties.
 * @param tasks
 * @param order
 * @returns
 */
export function lexicalSortTasks(tasks: Task[], order: 'ASC' | 'DESC'): Task[] {
  const flip = order === 'ASC' ? 1 : -1; // Flipping the order.
  return Array.from(tasks).sort(
    ({ lexical_order: a }: Task, { lexical_order: b }: Task) =>
      (a > b ? 1 : a < b ? -1 : 0) * flip
  );
}
