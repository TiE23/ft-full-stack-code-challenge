import { cloneDeep } from 'lodash';

/**
 * Tried to find a way to generate this automatically with something like
 * Parameters<typeof Array.prototype.find> couldn't manage to figure out how to
 * support generics.
 */
type FindPredicate<T> = (value: T, index: number, array: T[]) => boolean;

/**
 * When doing optimistic updates I often need to find objects within an array
 * and need both their object and their index.
 * @param predicate Same function used in Array.find()
 * @param list
 * @returns
 */
export function findObjectAndIndex<T>(
  predicate: FindPredicate<T>,
  list?: T[]
): [number, T?] {
  const indexOfItem = list?.findIndex(predicate) || -1;
  return [indexOfItem, list?.[indexOfItem]];
}

/**
 * Same as findObjectAndIndex but clones the resulting object so you can
 * manipulate at will!
 * @param predicate Same function used in Array.find()
 * @param list
 * @returns
 */
export function findObjectAndIndexCloneDeep<T>(
  predicate: FindPredicate<T>,
  list?: T[]
): [number, T?] {
  const indexOfItem = list?.findIndex(predicate) || -1;
  return [indexOfItem, cloneDeep(list?.[indexOfItem])];
}
