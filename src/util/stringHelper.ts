export function truncate(str: string, maxLength: number = 5): string {
  return str.length > maxLength ? str.substring(0, maxLength - 2) + ".." : str;
}