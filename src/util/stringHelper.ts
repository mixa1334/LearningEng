export function truncate(str: string, maxLength: number = 5): string {
  return str.length > maxLength ? str.substring(0, maxLength - 2) + ".." : str;
}

export const trimTextForSaving = (text: string): string => {
  return text.replaceAll(/(\r\n|\n|\r)/g, " ").trim();
};