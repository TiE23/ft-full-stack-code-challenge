import { LexicalOrder } from '../types/entity.types';

/**
 * This is adapted from a solution shared on StackOverflow.
 * https://stackoverflow.com/a/38927158/3120546
 *
 * This provides a very hacky method to allow for non-mutating ordering, by
 * taking advantage of lexigraphical sorting.
 *
 * I wanted to allow a user to sort their Tasks and Categories manually, but wanted
 * to avoid writing a number of updates to rows to shift them around.
 * For example, if I made a Task go to the top at position 0 I would have to update
 * all following tasks with +1 to their order. That would work just fine... but
 * I wanted to do something different! To imagine we're dealing with a large
 * amount of data we don't want to be constantly reading/updating.
 *
 * Now, I considered some other possible solutions such as a map, or a comma-separated
 * string, or even a linked list solution using a special table relationship.
 * But they all seemed like a major pain in the butt to get working in a short
 * span of time.
 *
 * Anyway. So let's say I put in a first Task. It'll be given the letter "n",
 * which is *about* in the middle of the alphabet as the 14th letter.
 *
 * Now, add another Task. It'll be told to go after "n". It'll be given "u",
 * which is the 21st letter, *about* the middle between n (14th) and z (26th).
 *
 * Well, let's add a Task between those two. It'll ask to be placed between
 * "n" and "u". It'll get "r", the 18th letter which is between 14th and 21st.
 *
 * Now, move that last "u" Task between those two, "n" and "r". It'll get "p".
 *
 * This keeps happening.
 * "n" and "p" returns "o"
 * "n" and "o" returns "nn" (!)
 * Woah, that's different! Well, that's because "n" and "o" are consecutive, and
 * "nn" comes after "n" and before "o" in a alphabetic sort.
 *
 * Note that whenever the algorithm needs to use a new character it uses "n"
 * because it is in the middle of the alphabet as the 14th letter in a basic
 * attempt to keep strings short.
 *
 * I want to say that, yes, I did borrow this implementation from StackOverflow
 * to save me time, but this wasn't difficult to imagine as a fun solution.
 *
 * Performs character code manipulation based off ASCII codes where 97-122 are a-z.
 * @param prev
 * @param next
 */
export function insertLexicalSort(prev: string, next: string): string {
  let pos = 0;
  let p = 0;
  let n = 0;

  prev = prev.toLowerCase().trim();
  next = next.toLowerCase().trim();

  if (prev.match(/[^a-z]/) || prev.match(/[^a-z]/)) {
    throw new Error('Strings can only contain the letters a-z.');
  }

  /* A limitation is that if next contains only "a"s there's no way to write a
   * string that sorts before it. So we must throw.
   * This won't happen in normal use. Only a human could force such a situation.
   */
  if (next.match(/^a+$/)) {
    throw new Error(
      'Next string cannot be only "a" as nothing can come before it.'
    );
  }

  // Find the leftmost non-matching character. That's where we'll start.
  // Ex 1: "", ""     -> pos = 0
  // Ex 2: "a", "c"   -> pos = 0
  // Ex 3: "a", "b"   -> pos = 0
  // Ex 4: "aa", "ab" -> pos = 1
  // Ex 5: "", "ab"    -> pos = 0
  for (pos = 0; p === n; ++pos) {
    p = pos < prev.length ? prev.charCodeAt(pos) : 96; // "`" - the character before "a"
    n = pos < next.length ? next.charCodeAt(pos) : 123; // "{" - the character after "z"
  }

  // Start the new string that we'll return.
  // Ex 1: str = ""
  // Ex 2: str = ""
  // Ex 3: str = ""
  // Ex 4: str = "a"
  // Ex 5: str = ""
  let str = prev.slice(0, pos - 1);

  if (p === 96) {
    // The case that p is at the beginning (no letter). (Ex 1, 2, 3, and 5)
    while (n === 97) {
      // While n is an "a". (Ex 5)
      n = pos < next.length ? next.charCodeAt(pos++) : 123; // Search for the first non "a".
      // Add an "a" to str to match next. (Ex 5 Becomes "a", then "aa" to sort before "ab").
      str += 'a';
    }
    if (n === 98) {
      // When n is a "b".
      str += 'a'; // Insert an "a", as it goes before "b".
      n = 123; // Set next to end of alphabet.
    }
  } else if (p + 1 === n) {
    // Found consecutive characters. (Ex: "ab")
    str += String.fromCharCode(p); // Insert the prev character. (Ex: "aa")
    n = 123; // Set next to end of alphabet. "aa_" will come before "ab".

    // At the "z" edge we just repeat "z" to come after whatever "z"s we got.
    while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) === 122) {
      str += 'z';
    }
  }

  // Append the middle character at the end.
  return str + String.fromCharCode(Math.ceil((p + n) / 2));
}

interface SortableEntity {
  id: number;
  lexical_order: LexicalOrder;
}

/**
 * Takes a list of Tasks or Categories, copies it, and then sorts them by their
 * lexical_order properties.
 * @param entities
 * @param order
 * @returns
 */
export function lexicallySortEntities<T extends SortableEntity>(
  entities: T[],
  order: 'ASC' | 'DESC'
): T[] {
  const flip = order === 'ASC' ? 1 : -1; // Flipping the order.
  return Array.from(entities).sort(
    ({ lexical_order: a }: T, { lexical_order: b }: T) =>
      (a > b ? 1 : a < b ? -1 : 0) * flip
  );
}

/**
 * Given the entity's ID and the position you want to position it into this will
 * return what lexical order string it should get to sort in the correct slot
 * within the provided sorted Entities.
 * @param sortedEntities the SORTED array of sibling Entities
 * @param id the id of the entity you're trying to position
 * @param position if set to a negative number it will place it at the end
 * @returns the new lexical_order the entity should use.
 */
export function positionEntity<T extends SortableEntity>(
  sortedEntities: T[],
  id: number,
  position: number
): LexicalOrder {
  let prevLex = '';
  let nextLex = '';

  // Check to see if the Entity with given id is already present in the array.
  const currentPosition = sortedEntities.findIndex(
    (entity) => entity.id === id
  );

  // Handle position of -1. But if the Entity is present AND last in the array
  // set it to its current position so as to not needlessly change the order.
  let newPosition =
    position < 0
      ? currentPosition === sortedEntities.length - 1
        ? currentPosition
        : sortedEntities.length
      : position;

  /**
   * If we're moving an Entity that is already in this list we must take an
   * extra step if we're moving it to a position further down the list. Why?
   * Well, imagine if we had three Entities [I, III, III]. If we say we want
   * to move I to be second in the list and become [II, I, III] we would want to
   * tell this function to "move I to new position 1". Well, what's really going
   * to happen is it'll look at the array of [I, II, III] and go "okay, let's
   * place I after I and before II". Becoming [I, II, III].
   * [[Record scratch]]
   * "Wait a second! It didn't move!" You say, "you mean it'll try to place 'I'
   * behind itself??!!"
   * That's right! So, when moving (as opposed to inserting) an Entity to be
   * later in the order we need to bump that new position by 1 extra so it can
   * go after its past self.
   * So, with this in place, it'll move "I" not to position 1, but to position 2
   * to be behind II and before III. Becoming [II, I, III].
   */
  if (currentPosition !== -1 && currentPosition < newPosition) {
    ++newPosition;
  }

  if (newPosition >= sortedEntities.length) {
    prevLex = sortedEntities[sortedEntities.length - 1].lexical_order;
  } else if (sortedEntities[newPosition].id === id) {
    return sortedEntities[newPosition].lexical_order;
  } else if (newPosition === 0) {
    nextLex = sortedEntities[0].lexical_order;
  } else {
    prevLex = sortedEntities[newPosition - 1].lexical_order;
    nextLex = sortedEntities[newPosition].lexical_order;
  }

  return insertLexicalSort(prevLex, nextLex);
}
