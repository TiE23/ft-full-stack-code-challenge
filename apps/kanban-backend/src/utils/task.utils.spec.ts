import { Task } from '../task/entities/task.entity';
import { taskFactory } from '../testUtils/task.testUtils';
import { lexicalSortTasks } from './task.utils';

describe('lexicalSortTasks()', () => {
  describe('happy path', () => {
    let testTasks: Task[] = [];
    beforeEach(() => {
      testTasks = [];
      testTasks.push(taskFactory({ id: 0, lexical_order: 'f' }));
      testTasks.push(taskFactory({ id: 1, lexical_order: 'b' }));
      testTasks.push(taskFactory({ id: 2, lexical_order: 'x' }));
      testTasks.push(taskFactory({ id: 3, lexical_order: 'm' }));
    });

    it('should sort ascending', () => {
      expect(lexicalSortTasks(testTasks, 'ASC').map((task) => task.id)).toEqual(
        [1, 0, 3, 2]
      );
      // Should not modify the order of the original array.
      expect(testTasks.map((task) => task.id)).toEqual([0, 1, 2, 3]);
    });
    it('should sort descending', () => {
      expect(
        lexicalSortTasks(testTasks, 'DESC').map((task) => task.id)
      ).toEqual([2, 3, 0, 1]);
      // Should not modify the order of the original array.
      expect(testTasks.map((task) => task.id)).toEqual([0, 1, 2, 3]);
    });
  });
});
