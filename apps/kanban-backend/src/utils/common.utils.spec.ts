import { insertLexicalSort } from './common.utils';

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
