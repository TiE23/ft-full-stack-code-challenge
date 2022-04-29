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
 * Woah, that's different! Well, that;s because "n" and "o" are consecutive, and
 * "nn" comes after "n" and before "o" in a alphabetic sort.
 *
 * I want to say that, yes, I did borrow this implementation from StackOverflow
 * to save me time, but this wasn't difficult to imagine as a fun solution.
 *
 * Performs character code manipulation based off ASCII codes where 97-122 are a-z.
 * @param prev
 * @param next
 */
export function insertLexiSort(prev: string, next: string): string {
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
