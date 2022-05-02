/**
 * Used for Task details.
 * @param input
 * @returns
 */
export function parseAndPrintDate(input: string): string {
  return new Date(input).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
