import { insertLexiSort } from './lexigraphicalSorting';

describe('insertLexiSort()', () => {
  describe('unhappy path', () => {
    it('should throw on malformed input', () => {
      expect(() => insertLexiSort('!', '@')).toThrow();
    });

    it('should throw with "" and "a"', () => {
      expect(() => insertLexiSort('', 'a')).toThrow();
    });

    it('should throw with "" and "aaa"', () => {
      expect(() => insertLexiSort('', 'aaa')).toThrow();
    });
  });

  describe('happy path', () => {
    it('"" and "aaab" should work correctly', () => {
      expect(insertLexiSort('', 'aaab')).toBe('aaaan');
    });
    it('"" and "" should work correctly', () => {
      expect(insertLexiSort('', '')).toBe('n');
    });

    it('"n" and "" should work correctly', () => {
      expect(insertLexiSort('n', '')).toBe('u');
    });

    it('"zy" and "zz" should correctly handle', () => {
      expect(insertLexiSort('zy', 'zz')).toBe('zyn');
    });

    it('"a" and "c" should work correctly', () => {
      expect(insertLexiSort('a', 'c')).toBe('b');
    });

    it('"a" and "b" should work correctly', () => {
      expect(insertLexiSort('a', 'b')).toBe('an');
    });

    it('"a" and "an" should work correctly', () => {
      expect(insertLexiSort('a', 'an')).toBe('ag');
    });

    it('"z" and "" should work correctly', () => {
      expect(insertLexiSort('z', '')).toBe('zn');
    });

    it('"zz" and "" should work correctly', () => {
      expect(insertLexiSort('zz', '')).toBe('zzn');
    });

    it('handles a typical insert series correctly', () => {
      expect(insertLexiSort('', '')).toBe('n');
      expect(insertLexiSort('n', '')).toBe('u');
      expect(insertLexiSort('n', 'u')).toBe('r');
      expect(insertLexiSort('n', 'r')).toBe('p');
      expect(insertLexiSort('n', 'p')).toBe('o');
      expect(insertLexiSort('n', 'o')).toBe('nn');
      expect(insertLexiSort('n', 'nn')).toBe('ng');
      expect(insertLexiSort('n', 'ng')).toBe('nd');
      expect(insertLexiSort('n', 'nd')).toBe('nb');

      // This is a limitation of the algorithm. It should be "na" but rounding prevents it.
      expect(insertLexiSort('n', 'nb')).toBe('nan');
    });

    it('avoids the dead end of a series of "a"s', () => {
      expect(insertLexiSort('', 'b')).toBe('an');
      expect(insertLexiSort('', 'an')).toBe('ag');
      expect(insertLexiSort('', 'ag')).toBe('ad');
      expect(insertLexiSort('', 'ad')).toBe('ab');
      expect(insertLexiSort('', 'ab')).toBe('aan');
      expect(insertLexiSort('', 'aan')).toBe('aag');
      expect(insertLexiSort('', 'aag')).toBe('aad');
      expect(insertLexiSort('', 'aad')).toBe('aab');
      expect(insertLexiSort('', 'aab')).toBe('aaan');
    });

    it('handles "z" edge case correctly', () => {
      expect(insertLexiSort('y', '')).toBe('z');
      expect(insertLexiSort('z', '')).toBe('zn');
      expect(insertLexiSort('zn', '')).toBe('zu');
      expect(insertLexiSort('zu', '')).toBe('zx');
      expect(insertLexiSort('zx', '')).toBe('zz');
      expect(insertLexiSort('zz', '')).toBe('zzn');
    });
  });
});
