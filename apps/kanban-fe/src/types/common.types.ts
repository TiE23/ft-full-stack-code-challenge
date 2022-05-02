/**
 * Basically so I don't have to write `SomeType | null` myself.
 */
export type Optional<T> = T | null;

/**
 * Had to define this because TS wasn't catching on that something I was assigning
 * it was POSSIBLY undefined.
 */
export type Possible<T> = T | undefined;
