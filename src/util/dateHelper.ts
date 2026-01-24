export enum DateShifts {
  yesterday = 86400000,
  today = 0,
}

class DateHelper {

  getCurrentDate(dateShift: DateShifts = DateShifts.today): string {
    return new Date(Date.now() - dateShift).toISOString().split("T")[0];
  }
}

export const dateHelper = new DateHelper();