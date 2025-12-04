/**
 * Format a date object to yyyy-mm-dd
 *
 * @param date Date object
 * @returns yyyy-mm-dd
 */
export function formatDateYYYYMMDD(date: Date): `${string}-${string}-${string}` {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
