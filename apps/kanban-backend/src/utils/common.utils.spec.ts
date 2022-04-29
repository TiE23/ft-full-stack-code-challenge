import { CategoryEntity } from '../category/entities/category.entity';
import { TaskEntity } from '../task/entities/task.entity';
import { taskFactory } from '../testUtils/task.testUtils';
import { categoryFactory } from '../testUtils/category.testUtils';
import {
  findLexicalPosition,
  lexicallySortEntities,
  positionEntity,
} from './common.utils';

describe('insertLexicalSort()', () => {
  describe('unhappy path', () => {
    it('should throw on malformed input', () => {
      expect(() => findLexicalPosition('!', '@')).toThrow();
    });

    it('should throw with "" and "a"', () => {
      expect(() => findLexicalPosition('', 'a')).toThrow();
    });

    it('should throw with "" and "aaa"', () => {
      expect(() => findLexicalPosition('', 'aaa')).toThrow();
    });
  });

  describe('happy path', () => {
    it('"" and "aaab" should work correctly', () => {
      expect(findLexicalPosition('', 'aaab')).toBe('aaaan');
    });
    it('"" and "" should work correctly', () => {
      expect(findLexicalPosition('', '')).toBe('n');
    });

    it('"n" and "" should work correctly', () => {
      expect(findLexicalPosition('n', '')).toBe('u');
    });

    it('"zy" and "zz" should correctly handle', () => {
      expect(findLexicalPosition('zy', 'zz')).toBe('zyn');
    });

    it('"a" and "c" should work correctly', () => {
      expect(findLexicalPosition('a', 'c')).toBe('b');
    });

    it('"a" and "b" should work correctly', () => {
      expect(findLexicalPosition('a', 'b')).toBe('an');
    });

    it('"a" and "an" should work correctly', () => {
      expect(findLexicalPosition('a', 'an')).toBe('ag');
    });

    it('"z" and "" should work correctly', () => {
      expect(findLexicalPosition('z', '')).toBe('zn');
    });

    it('"zz" and "" should work correctly', () => {
      expect(findLexicalPosition('zz', '')).toBe('zzn');
    });

    it('handles a typical insert series correctly', () => {
      expect(findLexicalPosition('', '')).toBe('n');
      expect(findLexicalPosition('n', '')).toBe('u');
      expect(findLexicalPosition('n', 'u')).toBe('r');
      expect(findLexicalPosition('n', 'r')).toBe('p');
      expect(findLexicalPosition('n', 'p')).toBe('o');
      expect(findLexicalPosition('n', 'o')).toBe('nn');
      expect(findLexicalPosition('n', 'nn')).toBe('ng');
      expect(findLexicalPosition('n', 'ng')).toBe('nd');
      expect(findLexicalPosition('n', 'nd')).toBe('nb');

      // This is a limitation of the algorithm. It should be "na" but rounding prevents it.
      expect(findLexicalPosition('n', 'nb')).toBe('nan');
    });

    it('avoids the dead end of a series of "a"s', () => {
      expect(findLexicalPosition('', 'b')).toBe('an');
      expect(findLexicalPosition('', 'an')).toBe('ag');
      expect(findLexicalPosition('', 'ag')).toBe('ad');
      expect(findLexicalPosition('', 'ad')).toBe('ab');
      expect(findLexicalPosition('', 'ab')).toBe('aan');
      expect(findLexicalPosition('', 'aan')).toBe('aag');
      expect(findLexicalPosition('', 'aag')).toBe('aad');
      expect(findLexicalPosition('', 'aad')).toBe('aab');
      expect(findLexicalPosition('', 'aab')).toBe('aaan');
    });

    it('handles "z" edge case correctly', () => {
      expect(findLexicalPosition('y', '')).toBe('z');
      expect(findLexicalPosition('z', '')).toBe('zn');
      expect(findLexicalPosition('zn', '')).toBe('zu');
      expect(findLexicalPosition('zu', '')).toBe('zx');
      expect(findLexicalPosition('zx', '')).toBe('zz');
      expect(findLexicalPosition('zz', '')).toBe('zzn');
    });
  });
});

describe('lexicallySortEntities()', () => {
  describe('sort Tasks', () => {
    let testTasks: TaskEntity[] = [];
    beforeEach(() => {
      testTasks = [];
      testTasks.push(taskFactory({ id: 0, lexical_order: 'f' }));
      testTasks.push(taskFactory({ id: 1, lexical_order: 'b' }));
      testTasks.push(taskFactory({ id: 2, lexical_order: 'x' }));
      testTasks.push(taskFactory({ id: 3, lexical_order: 'm' }));
    });

    it('should sort ascending', () => {
      expect(
        lexicallySortEntities<TaskEntity>(testTasks, 'ASC').map(
          (task) => task.id
        )
      ).toEqual([1, 0, 3, 2]);
      // Should not modify the order of the original array.
      expect(testTasks.map((task) => task.id)).toEqual([0, 1, 2, 3]);
    });
    it('should sort descending', () => {
      expect(
        lexicallySortEntities<TaskEntity>(testTasks, 'DESC').map(
          (task) => task.id
        )
      ).toEqual([2, 3, 0, 1]);
      // Should not modify the order of the original array.
      expect(testTasks.map((task) => task.id)).toEqual([0, 1, 2, 3]);
    });
  });
});

describe('positionEntity()', () => {
  describe('inserting Tasks', () => {
    let testTasks: TaskEntity[] = [];
    beforeEach(() => {
      testTasks = [];
      testTasks.push(taskFactory({ id: 0, lexical_order: 'c' }));
      testTasks.push(taskFactory({ id: 1, lexical_order: 'e' }));
      testTasks.push(taskFactory({ id: 2, lexical_order: 'f' }));
      testTasks.push(taskFactory({ id: 3, lexical_order: 'h' }));
    });

    it('should insert to -1 correctly', () => {
      expect(positionEntity(testTasks, -1, -1)).toBe('r'); // c, e, f, h, <r>
    });

    it('should insert to 0 correctly', () => {
      expect(positionEntity(testTasks, -1, 0)).toBe('b'); // <b>, c, e, f, h
    });

    it('should insert to 1 correctly', () => {
      expect(positionEntity(testTasks, -1, 1)).toBe('d'); // c, <d>, e, f, h
    });

    it('should insert to 2 correctly', () => {
      expect(positionEntity(testTasks, -1, 2)).toBe('en'); // c, e, <en>, f, h
    });

    it('should insert to 3 correctly', () => {
      expect(positionEntity(testTasks, -1, 3)).toBe('g'); // c, e, f, <g>, h
    });

    it('should insert to 4 correctly', () => {
      expect(positionEntity(testTasks, -1, 4)).toBe('r'); // c, e, f, h, <r>
    });
  });

  describe('repositioning Tasks', () => {
    let testTasks: TaskEntity[] = [];
    beforeEach(() => {
      testTasks = [];
      testTasks.push(taskFactory({ id: 0, lexical_order: 'c' }));
      testTasks.push(taskFactory({ id: 1, lexical_order: 'e' }));
      testTasks.push(taskFactory({ id: 2, lexical_order: 'f' }));
      testTasks.push(taskFactory({ id: 2, lexical_order: 'h' }));
    });

    it('should reposition 0 to 1', () => {
      expect(positionEntity(testTasks, 0, 1)).toBe('en'); // -c-, e, +e+, f, h
    });

    it('should reposition 1 to 0', () => {
      expect(positionEntity(testTasks, 1, 0)).toBe('b'); // +b+, c, -e-, f, h
    });

    it('should reposition 0 to 2', () => {
      expect(positionEntity(testTasks, 0, 2)).toBe('g'); // -c-, e, f, +g+, h
    });

    it('should reposition 2 to 0', () => {
      expect(positionEntity(testTasks, 2, 0)).toBe('b'); // +b+, c, -e-, f, h
    });

    it('should reposition 0 to 3', () => {
      expect(positionEntity(testTasks, 0, 3)).toBe('r'); // -c-, e, f, h, +r+
    });

    it('should reposition 3 to 0', () => {
      expect(positionEntity(testTasks, 3, 0)).toBe('b'); // +b+, c, e, f, -h-
    });

    it('should reposition 1 to 2', () => {
      expect(positionEntity(testTasks, 1, 2)).toBe('g'); // c, -e-, f, +g+, h
    });

    it('should reposition 2 to 1', () => {
      expect(positionEntity(testTasks, 2, 1)).toBe('d'); // c, +d+, e, -f-, h
    });
  });
  describe('inserting Categories', () => {
    let testCategories: CategoryEntity[] = [];
    beforeEach(() => {
      testCategories = [];
      testCategories.push(categoryFactory({ id: 0, lexical_order: 'c' }));
      testCategories.push(categoryFactory({ id: 1, lexical_order: 'e' }));
      testCategories.push(categoryFactory({ id: 2, lexical_order: 'f' }));
      testCategories.push(categoryFactory({ id: 3, lexical_order: 'h' }));
    });

    it('should insert to -1 correctly', () => {
      expect(positionEntity(testCategories, -1, -1)).toBe('r'); // c, e, f, h, <r>
    });

    it('should insert to 0 correctly', () => {
      expect(positionEntity(testCategories, -1, 0)).toBe('b'); // <b>, c, e, f, h
    });

    it('should insert to 1 correctly', () => {
      expect(positionEntity(testCategories, -1, 1)).toBe('d'); // c, <d>, e, f, h
    });

    it('should insert to 2 correctly', () => {
      expect(positionEntity(testCategories, -1, 2)).toBe('en'); // c, e, <en>, f, h
    });

    it('should insert to 3 correctly', () => {
      expect(positionEntity(testCategories, -1, 3)).toBe('g'); // c, e, f, <g>, h
    });

    it('should insert to 4 correctly', () => {
      expect(positionEntity(testCategories, -1, 4)).toBe('r'); // c, e, f, h, <r>
    });
  });

  describe('repositioning Categories', () => {
    let testCategories: CategoryEntity[] = [];
    beforeEach(() => {
      testCategories = [];
      testCategories.push(categoryFactory({ id: 0, lexical_order: 'c' }));
      testCategories.push(categoryFactory({ id: 1, lexical_order: 'e' }));
      testCategories.push(categoryFactory({ id: 2, lexical_order: 'f' }));
      testCategories.push(categoryFactory({ id: 3, lexical_order: 'h' }));
    });

    it('should reposition 0 to 1', () => {
      expect(positionEntity(testCategories, 0, 1)).toBe('en'); // -c-, e, +e+, f, h
    });

    it('should reposition 1 to 0', () => {
      expect(positionEntity(testCategories, 1, 0)).toBe('b'); // +b+, c, -e-, f, h
    });

    it('should reposition 0 to 2', () => {
      expect(positionEntity(testCategories, 0, 2)).toBe('g'); // -c-, e, f, +g+, h
    });

    it('should reposition 2 to 0', () => {
      expect(positionEntity(testCategories, 2, 0)).toBe('b'); // +b+, c, -e-, f, h
    });

    it('should reposition 0 to 3', () => {
      expect(positionEntity(testCategories, 0, 3)).toBe('r'); // -c-, e, f, h, +r+
    });

    it('should reposition 3 to 0', () => {
      expect(positionEntity(testCategories, 3, 0)).toBe('b'); // +b+, c, e, f, -h-
    });

    it('should reposition 1 to 2', () => {
      expect(positionEntity(testCategories, 1, 2)).toBe('g'); // c, -e-, f, +g+, h
    });

    it('should reposition 2 to 1', () => {
      expect(positionEntity(testCategories, 2, 1)).toBe('d'); // c, +d+, e, -f-, h
    });
  });
});
