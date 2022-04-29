import { Category } from '../category/entities/category.entity';
import { Task } from '../task/entities/task.entity';
import { taskFactory } from '../testUtils/task.testUtils';
import { categoryFactory } from '../testUtils/category.testUtils';
import {
  insertLexicalSort,
  lexicallySortEntities,
  positionEntity,
} from './common.utils';

describe('insertLexicalSort()', () => {
  describe('unhappy path', () => {
    it('should throw on malformed input', () => {
      expect(() => insertLexicalSort('!', '@')).toThrow();
    });

    it('should throw with "" and "a"', () => {
      expect(() => insertLexicalSort('', 'a')).toThrow();
    });

    it('should throw with "" and "aaa"', () => {
      expect(() => insertLexicalSort('', 'aaa')).toThrow();
    });
  });

  describe('happy path', () => {
    it('"" and "aaab" should work correctly', () => {
      expect(insertLexicalSort('', 'aaab')).toBe('aaaan');
    });
    it('"" and "" should work correctly', () => {
      expect(insertLexicalSort('', '')).toBe('n');
    });

    it('"n" and "" should work correctly', () => {
      expect(insertLexicalSort('n', '')).toBe('u');
    });

    it('"zy" and "zz" should correctly handle', () => {
      expect(insertLexicalSort('zy', 'zz')).toBe('zyn');
    });

    it('"a" and "c" should work correctly', () => {
      expect(insertLexicalSort('a', 'c')).toBe('b');
    });

    it('"a" and "b" should work correctly', () => {
      expect(insertLexicalSort('a', 'b')).toBe('an');
    });

    it('"a" and "an" should work correctly', () => {
      expect(insertLexicalSort('a', 'an')).toBe('ag');
    });

    it('"z" and "" should work correctly', () => {
      expect(insertLexicalSort('z', '')).toBe('zn');
    });

    it('"zz" and "" should work correctly', () => {
      expect(insertLexicalSort('zz', '')).toBe('zzn');
    });

    it('handles a typical insert series correctly', () => {
      expect(insertLexicalSort('', '')).toBe('n');
      expect(insertLexicalSort('n', '')).toBe('u');
      expect(insertLexicalSort('n', 'u')).toBe('r');
      expect(insertLexicalSort('n', 'r')).toBe('p');
      expect(insertLexicalSort('n', 'p')).toBe('o');
      expect(insertLexicalSort('n', 'o')).toBe('nn');
      expect(insertLexicalSort('n', 'nn')).toBe('ng');
      expect(insertLexicalSort('n', 'ng')).toBe('nd');
      expect(insertLexicalSort('n', 'nd')).toBe('nb');

      // This is a limitation of the algorithm. It should be "na" but rounding prevents it.
      expect(insertLexicalSort('n', 'nb')).toBe('nan');
    });

    it('avoids the dead end of a series of "a"s', () => {
      expect(insertLexicalSort('', 'b')).toBe('an');
      expect(insertLexicalSort('', 'an')).toBe('ag');
      expect(insertLexicalSort('', 'ag')).toBe('ad');
      expect(insertLexicalSort('', 'ad')).toBe('ab');
      expect(insertLexicalSort('', 'ab')).toBe('aan');
      expect(insertLexicalSort('', 'aan')).toBe('aag');
      expect(insertLexicalSort('', 'aag')).toBe('aad');
      expect(insertLexicalSort('', 'aad')).toBe('aab');
      expect(insertLexicalSort('', 'aab')).toBe('aaan');
    });

    it('handles "z" edge case correctly', () => {
      expect(insertLexicalSort('y', '')).toBe('z');
      expect(insertLexicalSort('z', '')).toBe('zn');
      expect(insertLexicalSort('zn', '')).toBe('zu');
      expect(insertLexicalSort('zu', '')).toBe('zx');
      expect(insertLexicalSort('zx', '')).toBe('zz');
      expect(insertLexicalSort('zz', '')).toBe('zzn');
    });
  });
});

describe('lexicallySortEntities()', () => {
  describe('sort Tasks', () => {
    let testTasks: Task[] = [];
    beforeEach(() => {
      testTasks = [];
      testTasks.push(taskFactory({ id: 0, lexical_order: 'f' }));
      testTasks.push(taskFactory({ id: 1, lexical_order: 'b' }));
      testTasks.push(taskFactory({ id: 2, lexical_order: 'x' }));
      testTasks.push(taskFactory({ id: 3, lexical_order: 'm' }));
    });

    it('should sort ascending', () => {
      expect(
        lexicallySortEntities<Task>(testTasks, 'ASC').map((task) => task.id)
      ).toEqual([1, 0, 3, 2]);
      // Should not modify the order of the original array.
      expect(testTasks.map((task) => task.id)).toEqual([0, 1, 2, 3]);
    });
    it('should sort descending', () => {
      expect(
        lexicallySortEntities<Task>(testTasks, 'DESC').map((task) => task.id)
      ).toEqual([2, 3, 0, 1]);
      // Should not modify the order of the original array.
      expect(testTasks.map((task) => task.id)).toEqual([0, 1, 2, 3]);
    });
  });
});

describe('positionEntity()', () => {
  describe('inserting Tasks', () => {
    let testTasks: Task[] = [];
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
    let testTasks: Task[] = [];
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
    let testCategories: Category[] = [];
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
    let testCategories: Category[] = [];
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
