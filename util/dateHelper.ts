export enum DateShifts {
  yesterday = 86400000,
  today = 0,
}

export function getCurrentDate(
  dateShift: DateShifts = DateShifts.today
): string {
  return new Date(Date.now() - dateShift).toISOString().split("T")[0];
}
