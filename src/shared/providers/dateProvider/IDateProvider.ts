export interface IDateProvider {
  getDate(): string;
  addDaysFromNow(days: number): Date;
  addHoursFromNow(hours: number): Date;
  checkIfPast(date: Date): boolean;
}
