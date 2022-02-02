/**
 * Deletes multiple spaces or line breaks in query string and replaces them by one space
 * @param query pretty formatted query
 * @returns minimized query
 */
export function minimized(query: string): string {
  query = query.replace(/^[ \n]+/, '')
  return query.replace(/[ \n]+/gm, ' ');
}
